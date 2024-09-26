import { ClientEvent, ServerEvent } from '@bitoftrade/tss-core'
import { getKeyShareAdminsIndexes } from '@src/core'
import { EventHandler } from '@src/interfaces'
import { constructExternallyControllablePromise, ExternallyControllablePromise } from '@src/utils/promises'
import { Socket } from 'socket.io'
import { runSmManagerOnPort, stopSmManagerByPort } from './portSmManager'

enum KeyGenTssClientStatus {
	INIT = 'INIT',
	READY = 'READY',
	WAIT_TO_START = 'WAIT_TO_START',
	FINISHED = 'FINISHED',
	WAIT_TO_SIGN = 'WAIT_TO_SIGN',
	SIGNED_MESSAGE = 'SIGNED_MESSAGE'
}

export class KeyGenService {
	private port: number

	// tssClient -> eventName -> eventHandler
	private eventHandlersByTssClients: Map<string, Map<string, EventHandler>> = new Map()

	private status: Record<string, KeyGenTssClientStatus> = {}
	private signedMessageAddress: Record<string, string> = {}

	private indexes: Record<string, number> = {}
	private waitingIndexesToStartKeyGen: number[] = []
	// for signing process tssClients should be picked in specific order
	// determined in this.pickedIndexes array
	private pickedIndexesForSign: number[] = []
	// this variable used to keep track of which tssClients waiting for sign
	private waitingIndexesToStartSign: number[] = []

	private tssClientsReadyPromise: ExternallyControllablePromise<void> =
		constructExternallyControllablePromise<void>()
	private tssClientsFinishedPromise: ExternallyControllablePromise<void> =
		constructExternallyControllablePromise<void>()
	private tssClientsSignMessagePromise: ExternallyControllablePromise<string> =
		constructExternallyControllablePromise<string>()

	constructor(private tssClients: Map<string, Socket>, private threshold: number, private processId: string) {
		this.initListeners()
		this.initStatuses()
		this.port = runSmManagerOnPort()
	}

	initStatuses(): void {
		Array.from(this.tssClients.keys()).forEach(
			(address) => (this.status[address] = KeyGenTssClientStatus.INIT)
		)
	}

	initListeners(): void {
		this.tssClients.forEach((socket) => {
			const eventHandlers: Map<string, EventHandler> = new Map()
			const tssClientId = socket.handshake.auth.keyShareAdmin

			const addEventHandler = (event: string, handler: (...args: unknown[]) => void): void => {
				// use bind to set KeyGenService as this, because socket.on use Socket object as this
				const onEvent = handler.bind(this, tssClientId)
				socket.on(event, onEvent)
				// save event handlers to be able to remove listeners later
				eventHandlers.set(event, onEvent)
			}

			addEventHandler(ClientEvent.KEY_GEN_ERROR, this.onTssClientError)
			addEventHandler(ClientEvent.KEY_GEN_WAIT_FOR_OTHER_TO_START, this.onTssClientWaitToStartKeyGen)
			addEventHandler(ClientEvent.KEY_GEN_WAIT_FOR_OTHER_TO_SIGN, this.onTssClientWaitToSign)
			addEventHandler(ClientEvent.KEY_GEN_READY, this.onTssClientReady)
			addEventHandler(ClientEvent.KEY_GEN_FINISHED, this.onTssClientFinished)
			addEventHandler(ClientEvent.KEY_GEN_SIGNED_MSG_ADDRESS, this.onTssClientSignedMsgAddress)

			this.eventHandlersByTssClients.set(tssClientId, eventHandlers)
		})
	}

	broadcast(event: ServerEvent, ...args: string[]): void {
		// first param is always process id
		this.tssClients.forEach((socket) => {
			socket.emit(event, this.processId, ...args)
		})
	}

	pickTssClientsForSign(): string[] {
		// maybe use more advanced picking technique ??
		const neededTssClientsAmount = this.threshold + 1
		return Array.from(this.tssClients.keys()).slice(0, neededTssClientsAmount)
	}

	initKeyGen(): void {
		this.pickNextTssClientToStart(ServerEvent.KEY_GEN_START)
	}

	initMsgSign(): void {
		const pickedTssClients = this.pickTssClientsForSign()
		const pickedIndexes = []
		pickedTssClients.forEach((holder) => pickedIndexes.push(this.indexes[holder]))
		this.pickedIndexesForSign = [...pickedIndexes]
		this.waitingIndexesToStartSign = [...pickedIndexes]
		this.pickNextTssClientToStart(ServerEvent.KEY_GEN_INIT_MSG_SIGN)
	}

	pickNextTssClientToStart(event: ServerEvent): void {
		const isKeyGen = event === ServerEvent.KEY_GEN_START
		const nextIndex = isKeyGen ? this.waitingIndexesToStartKeyGen[0] : this.waitingIndexesToStartSign[0]
		if (nextIndex) {
			const tssClient = Object.entries(this.indexes).find(([, value]) => value === nextIndex)[0]
			if (tssClient) {
				const socket = this.tssClients.get(tssClient)
				socket.emit(event, this.processId, !isKeyGen && this.pickedIndexesForSign)
			}
		}
	}

	async startKeyGen(msg: string, txHash: string): Promise<string> {
		this.indexes = await getKeyShareAdminsIndexes()
		this.waitingIndexesToStartKeyGen = Object.values(this.indexes).sort((a, b) => a - b)
		// onTssClientError rejects all promises
		// but catch block receives only first available rejection, other promises wont be caught
		// that's why it's needed to add extra catch handler for all promises
		this.tssClientsReadyPromise.promise.catch(() => {})
		this.tssClientsFinishedPromise.promise.catch(() => {})
		this.tssClientsSignMessagePromise.promise.catch(() => {})

		try {
			this.broadcast(ServerEvent.KEY_GEN_INIT, msg, txHash, this.port.toString())
			await this.tssClientsReadyPromise.promise

			this.initKeyGen()
			await this.tssClientsFinishedPromise.promise

			this.initMsgSign()
			const newSigner = await this.tssClientsSignMessagePromise.promise

			this.broadcast(ServerEvent.KEY_GEN_NEW_SIGNER_ADDRESS, newSigner)

			return newSigner
		} catch (error) {
			throw new Error(error)
		} finally {
			this.broadcast(ServerEvent.KEY_GEN_STOP)
			await this.cleanUp()
		}
	}

	onTssClientError(tssClientId: string, processId: string, msg: string): void {
		if (processId === this.processId && this.status[tssClientId]) {
			const errorMessage = `${tssClientId}, error: ${msg}`
			this.tssClientsReadyPromise.reject(errorMessage)
			this.tssClientsFinishedPromise.reject(errorMessage)
			this.tssClientsSignMessagePromise.reject(errorMessage)
		}
	}

	onTssClientReady(tssClientId: string, processId: string): void {
		if (processId === this.processId && this.status[tssClientId]) {
			this.status[tssClientId] = KeyGenTssClientStatus.READY
			if (this.isEveryTssClient(KeyGenTssClientStatus.READY)) {
				this.tssClientsReadyPromise.resolve()
			}
		}
	}

	onTssClientWaitToStartKeyGen(tssClientId: string, processId: string): void {
		if (processId === this.processId && this.status[tssClientId]) {
			this.status[tssClientId] = KeyGenTssClientStatus.WAIT_TO_START
			if (this.indexes[tssClientId] === this.waitingIndexesToStartKeyGen[0]) {
				this.waitingIndexesToStartKeyGen.shift()
				this.pickNextTssClientToStart(ServerEvent.KEY_GEN_START)
			}
		}
	}

	onTssClientFinished(tssClientId: string, processId: string): void {
		if (processId === this.processId && this.status[tssClientId]) {
			this.status[tssClientId] = KeyGenTssClientStatus.FINISHED
			if (this.isEveryTssClient(KeyGenTssClientStatus.FINISHED)) {
				this.tssClientsFinishedPromise.resolve()
			}
		}
	}

	onTssClientWaitToSign(tssClientId: string, processId: string): void {
		if (processId === this.processId && this.status[tssClientId]) {
			this.status[tssClientId] = KeyGenTssClientStatus.WAIT_TO_SIGN
			if (this.indexes[tssClientId] === this.waitingIndexesToStartSign[0]) {
				this.waitingIndexesToStartSign.shift()
				this.pickNextTssClientToStart(ServerEvent.KEY_GEN_INIT_MSG_SIGN)
			}
		}
	}

	onTssClientSignedMsgAddress(tssClientId: string, processId: string, address: string): void {
		if (processId === this.processId && this.status[tssClientId]) {
			this.status[tssClientId] = KeyGenTssClientStatus.SIGNED_MESSAGE
			this.signedMessageAddress[tssClientId] = address

			if (!Object.values(this.signedMessageAddress).every((add) => add === address)) {
				this.tssClientsSignMessagePromise.reject('Different generated addresses while key gen')
			} else if (Object.values(this.signedMessageAddress).length > this.threshold) {
				this.tssClientsSignMessagePromise.resolve(address)
			}
		}
	}

	async cleanUp(): Promise<void> {
		for (const tssClient of this.eventHandlersByTssClients.keys()) {
			const eventHandlers = this.eventHandlersByTssClients.get(tssClient)
			const socket = this.tssClients.get(tssClient)
			for (const [eventName, handler] of eventHandlers.entries()) {
				socket.removeListener(eventName, handler)
			}
		}

		await stopSmManagerByPort(this.port)
	}

	isEveryTssClient(status: KeyGenTssClientStatus): boolean {
		return Object.values(this.status).every((tssClientStatus) => tssClientStatus === status)
	}

	getIndexes(): Record<string, number> {
		return this.indexes
	}
}
