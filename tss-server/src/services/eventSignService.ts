import { ApproveSignParams, ClientEvent, ServerEvent } from '@bitoftrade/tss-core'
import { EventSignDto } from '@src/dto/eventSignDto'
import { EventHandler } from '@src/interfaces'
import initLogger from '@src/utils/logger'
import { constructExternallyControllablePromise, ExternallyControllablePromise } from '@src/utils/promises'
import { Server } from 'socket.io'
import { Logger } from 'winston'
import { runSmManagerOnPort, stopSmManagerByPort } from './portSmManager'

enum EventSignStatus {
	INIT = 'INIT',
	APPROVE = 'APPROVE',
	DECLINE = 'DECLINE',
	WAIT_TO_SIGN = 'WAIT_TO_SIGN',
	SIGNATURE = 'SIGNATURE'
}

export class EventSignService {
	private port: number

	// socketId -> eventName -> eventHandler
	private eventHandlersByTssClients: Map<string, Map<string, EventHandler>> = new Map()

	private status: Record<string, EventSignStatus> = {}
	private tssClientsApprovePromise: ExternallyControllablePromise<void> =
		constructExternallyControllablePromise<void>()
	private tssClientsSignedPromise: ExternallyControllablePromise<string> =
		constructExternallyControllablePromise<string>()

	private logger: Logger

	private generatedSignatures: Record<string, string> = {}

	private indexes: Record<string, number> = {}
	private signer: string
	private parties: number
	private threshold: number
	private pickedIndexesForSign: number[] = []
	private waitingIndexesToStartSign: number[] = []

	constructor(private io: Server, private processId: string) {
		this.logger = initLogger('EventSignService')
		this.initStatuses()
		this.initListeners()
		this.port = runSmManagerOnPort()
	}

	initStatuses(): void {
		Array.from(this.io.sockets.sockets.values()).forEach((socket) => {
			const tssClientId = socket.handshake.auth.keyShareAdmin
			this.status[tssClientId] = EventSignStatus.INIT
		})
	}

	initListeners(): void {
		Array.from(this.io.sockets.sockets.values()).forEach((socket) => {
			const eventHandlers: Map<string, EventHandler> = new Map()
			const tssClientId = socket.handshake.auth.keyShareAdmin

			const addEventHandler = (event: string, handler: (...args: unknown[]) => void): void => {
				const onEvent = handler.bind(this, tssClientId)
				socket.on(event, onEvent)
				eventHandlers.set(event, onEvent)
			}

			addEventHandler(ClientEvent.EVENT_SIGN_WAIT_FOR_OTHER_TO_SIGN, this.onTssClientWaitToSign)
			addEventHandler(ClientEvent.EVENT_SIGN_APPROVE, this.onTssClientApprove)
			addEventHandler(ClientEvent.EVENT_SIGN_SIGNATURE, this.onTssClientSigned)
			addEventHandler(ClientEvent.EVENT_SIGN_DECLINE, this.onTssClientDecline)

			this.eventHandlersByTssClients.set(socket.id, eventHandlers)
		})
	}

	broadcast(event: ServerEvent, ...args: (string | object)[]): void {
		this.io.emit(event, this.processId, ...args)
	}

	pickTssClientsIndexesToSign(): number[] {
		const neededTssClientsAmount = this.threshold + 1
		const pickedTssClients = Object.keys(this.indexes).slice(0, neededTssClientsAmount)
		const pickedIndexes = pickedTssClients.reduce((total, current) => [...total, this.indexes[current]], [])
		return pickedIndexes
	}

	initMsgSign(): void {
		const pickedIndexes = this.pickTssClientsIndexesToSign()
		this.pickedIndexesForSign = [...pickedIndexes]
		this.waitingIndexesToStartSign = [...pickedIndexes]
		this.pickNextTssClientToStartSign()
	}

	pickNextTssClientToStartSign(): void {
		const nextIndex = this.waitingIndexesToStartSign[0]
		if (nextIndex) {
			const tssClient = Object.entries(this.indexes).find(([, value]) => value === nextIndex)[0]
			if (tssClient) {
				const sockets = Array.from(this.io.sockets.sockets.values())
				const socket = sockets.find((socket) => socket.handshake.auth.keyShareAdmin === tssClient)
				socket.emit(ServerEvent.EVENT_SIGN_START, this.processId, this.pickedIndexesForSign)
			}
		}
	}

	async startEventSign(eventSignDto: EventSignDto): Promise<{
		signature: string
		signer: string
	}> {
		this.tssClientsApprovePromise.promise.catch(() => {})
		this.tssClientsSignedPromise.promise.catch(() => {})

		try {
			this.broadcast(ServerEvent.EVENT_SIGN_INIT, eventSignDto, this.port.toString())
			await this.tssClientsApprovePromise.promise

			this.initMsgSign()

			const signature = await this.tssClientsSignedPromise.promise

			return { signer: this.signer, signature }
		} catch (error) {
			this.logger.error('Error while start response sign', error)
			throw new Error(error)
		} finally {
			this.broadcast(ServerEvent.EVENT_SIGN_STOP)
			await this.cleanUp()
		}
	}

	statusAmount(status: EventSignStatus): number {
		return Object.values(this.status).reduce((total, current) => (current === status ? total + 1 : total), 0)
	}

	onTssClientApprove(tssClientId: string, processId: string, params: ApproveSignParams): void {
		this.logger.info(`${tssClientId} onTssClientApprove`)
		if (processId === this.processId && this.status[tssClientId]) {
			this.status[tssClientId] = EventSignStatus.APPROVE

			this.indexes[tssClientId] = params.index

			if (
				(this.signer && this.signer !== params.signer) ||
				(this.parties && this.parties !== params.parties) ||
				(this.threshold && this.threshold !== params.threshold)
			) {
				this.tssClientsApprovePromise.reject(
					'Got different signer or parties/threshold params from tssClients'
				)
			}

			if (!this.signer) this.signer = params.signer
			if (!this.parties) this.parties = params.parties
			if (!this.threshold) this.threshold = params.threshold

			if (this.statusAmount(EventSignStatus.APPROVE) > this.threshold) {
				this.tssClientsApprovePromise.resolve()
			}

			const potentialApprovesAmount =
				this.statusAmount(EventSignStatus.APPROVE) + this.statusAmount(EventSignStatus.INIT)

			if (potentialApprovesAmount <= this.threshold) {
				this.tssClientsApprovePromise.reject('Not enough tssClients')
			}
		}
	}

	onTssClientSigned(tssClientId: string, processId: string, signature: string): void {
		this.logger.info(`${tssClientId} onTssClientSigned`)
		if (processId === this.processId && this.status[tssClientId]) {
			this.status[tssClientId] = EventSignStatus.SIGNATURE
			this.generatedSignatures[tssClientId] = signature

			const sameSignatureAmount = Object.values(this.generatedSignatures).reduce(
				(total, current) => (current === signature ? total + 1 : total),
				0
			)
			if (sameSignatureAmount > this.threshold) {
				this.tssClientsSignedPromise.resolve(signature)
			}
		}
	}

	onTssClientWaitToSign(tssClientId: string, processId: string): void {
		if (processId === this.processId && this.status[tssClientId]) {
			this.status[tssClientId] = EventSignStatus.WAIT_TO_SIGN
			// if receive wait event from first in order tssClient
			if (this.indexes[tssClientId] === this.waitingIndexesToStartSign[0]) {
				this.waitingIndexesToStartSign.shift()
				this.pickNextTssClientToStartSign()
			}
		}
	}

	onTssClientDecline(tssClientId: string, processId: string): void {
		this.logger.info(`${tssClientId} onTssClientDecline`)
		if (processId === this.processId && this.status[tssClientId]) {
			this.status[tssClientId] = EventSignStatus.DECLINE
			const notDeclinedStatusesAmount = Object.values(this.status).reduce(
				(total, current) => (current !== EventSignStatus.DECLINE ? total + 1 : total),
				0
			)
			if (!this.threshold || notDeclinedStatusesAmount <= this.threshold) {
				this.tssClientsApprovePromise.reject(`${tssClientId} decline response tx signing`)
				this.tssClientsSignedPromise.reject(`${tssClientId} decline response tx signing`)
			}
		}
	}

	async cleanUp(): Promise<void> {
		this.logger.info('Clean up')

		for (const socketId of this.eventHandlersByTssClients.keys()) {
			const eventHandlers = this.eventHandlersByTssClients.get(socketId)
			const socket = this.io.sockets.sockets.get(socketId)
			for (const [eventName, handler] of eventHandlers.entries()) {
				socket.removeListener(eventName, handler)
			}
		}

		await stopSmManagerByPort(this.port)
	}
}
