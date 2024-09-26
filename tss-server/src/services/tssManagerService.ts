import { Server as WsServer, Socket } from 'socket.io'
import { TypedAuthSocket } from '../interfaces'
import { Server } from 'http'
import { KeyGenService } from './keyGenService'
import { ClientEvent, ServerEvent, AuthToken, ParsedEvent } from '@bitoftrade/tss-core'
import { getKeyShareAdmins, verifyAndParseEventOrReject } from '@src/core'
import { StartKeyGenDto } from '@src/dto/startKeyGenDto'
import { saveHandledSignedMessage } from '@src/utils/json'
import initLogger from '@src/utils/logger'
import { Logger } from 'winston'
import { EventSignDto } from '@src/dto/eventSignDto'
import { EventSignService } from './eventSignService'
import { verifyConnectedTssClientOrReject } from '@src/utils/auth'

export class TssManagerService {
	private logger: Logger
	private io: WsServer
	// keyShareAdmin address is unique id for every tss client
	// keyShareAdmin -> Socket
	public tssClients: Map<string, Socket>

	private processInProgress: Set<string> = new Set()

	public latestGeneratedAddress = ''

	constructor(server: Server) {
		this.logger = initLogger('TssManagerService')
		this.tssClients = new Map()
		this.io = new WsServer(server)
		this.authMiddleware()
		this.listen()
	}

	private authMiddleware(): void {
		this.io.use(async (socket: TypedAuthSocket<AuthToken>, next) => {
			const token: AuthToken = socket.handshake.auth
			try {
				await verifyConnectedTssClientOrReject(token)
				next()
			} catch (e) {
				this.logger.warn(`Failed to connect socket: ${token.keyShareAdmin}`)
				this.logger.warn(`error: ${e}`)
				next(new Error('Not authorized'))
			}
		})

		this.io.use(async (socket: TypedAuthSocket<AuthToken>, next) => {
			const token: AuthToken = socket.handshake.auth
			const isConnected = this.tssClients.has(token.keyShareAdmin)
			if (!isConnected) {
				next()
			} else {
				this.logger.warn(`Failed to connect same keyShareAdmin address: ${token.keyShareAdmin}`)
				next(new Error('Tss Client with same id(keyShareAdmin address) is already connected'))
			}
		})
	}

	private listen(): void {
		this.io.on(ServerEvent.CONNECTION, async (socket: Socket) => {
			const tssClientId = socket.handshake.auth.keyShareAdmin.toLowerCase()
			this.tssClients.set(tssClientId, socket)

			this.logger.info(`Client ${tssClientId} connected`)

			socket.once('disconnect', () => {
				this.tssClients.delete(tssClientId)
				this.logger.warn(`Client ${tssClientId} disconnected by server`)
			})

			socket.conn.on(ClientEvent.CLOSE, () => {
				this.tssClients.delete(tssClientId)
				this.logger.warn(`Client ${tssClientId} disconnected by client`)
			})
		})
	}

	async readyToStartEventSign(eventSignDto: EventSignDto): Promise<void> {
		this.preventSameProcessDuplicate(eventSignDto.txHash)

		if (this.io.sockets.sockets.size < 1) {
			throw new Error('No connected tss clients')
		}

		try {
			await verifyAndParseEventOrReject(
				eventSignDto.chainId,
				eventSignDto.txHash,
				eventSignDto.abi,
				eventSignDto.eventLogIndex
			)
		} catch (error) {
			throw new Error(error)
		}
	}

	async readyToStartKeyGen(parties: number, id: string): Promise<void> {
		this.preventSameProcessDuplicate(id)
		const neededTssClients = await getKeyShareAdmins()
		const connectedTssClients = Array.from(this.tssClients.keys())

		if (parties !== neededTssClients.length) {
			throw new Error('Parties is not equal to needed tss clients amount')
		}

		const isEveryoneConnected = neededTssClients.every((tssClientId) =>
			connectedTssClients.includes(tssClientId)
		)
		if (!isEveryoneConnected) {
			throw new Error('Not every tss client is connected')
		}
	}

	async getParticipatedTssClients(): Promise<Map<string, Socket>> {
		const tssClientsIds = await getKeyShareAdmins()
		const tssClientsMap: Map<string, Socket> = new Map()
		tssClientsIds.forEach((tssClientId) => tssClientsMap.set(tssClientId, this.tssClients.get(tssClientId)))
		return tssClientsMap
	}

	async startKeyGenProcess(msg: string, txHash: string, params: StartKeyGenDto): Promise<string> {
		try {
			this.preventSameProcessDuplicate(txHash)
			this.logger.info(`Start Key Gen protocol for txHash: ${txHash}`)
			this.processInProgress.add(txHash)
			const participatedTssClients = await this.getParticipatedTssClients()

			const keyGenService = new KeyGenService(participatedTssClients, params.threshold, txHash)
			this.latestGeneratedAddress = await keyGenService.startKeyGen(msg, txHash)

			await saveHandledSignedMessage(txHash)

			this.logger.info('Finish Key Gen protocol')

			return this.latestGeneratedAddress
		} catch (error) {
			this.logger.error('Failed to run key gen', error.message)
			throw new Error(error.message)
		} finally {
			this.processInProgress.delete(txHash)
		}
	}

	async startEventSignProcess(
		eventSignDto: EventSignDto
	): Promise<ParsedEvent & { signature: string; signer: string }> {
		try {
			this.preventSameProcessDuplicate(eventSignDto.txHash)
			this.logger.info(`Start Event Sign protocol ${eventSignDto.chainId} ${eventSignDto.txHash}`)
			this.processInProgress.add(eventSignDto.txHash)

			// TODO: optimize double verification (here and in readyToStartEventSign function)
			const parsedEvent = await verifyAndParseEventOrReject(
				eventSignDto.chainId,
				eventSignDto.txHash,
				eventSignDto.abi
			)
			const service = new EventSignService(this.io, eventSignDto.txHash)
			const { signature, signer } = await service.startEventSign(eventSignDto)

			this.logger.info(`Finish Event Sign protocol ${eventSignDto.txHash}`)

			return { ...parsedEvent, signature, signer }
		} catch (error) {
			this.logger.error('Failed to sign Event', error.message)
			throw new Error(error.message)
		} finally {
			this.processInProgress.delete(eventSignDto.txHash)
		}
	}

	preventSameProcessDuplicate(processId: string): never | void {
		if (this.processInProgress.has(processId)) {
			throw new Error('Protocol with same txHash is already in progress')
		}
	}

	connectedTssClients(): string[] {
		return Array.from(this.tssClients.keys())
	}
}
