import express from 'express'
import env from './utils/env.validation'
import cors from 'cors'
import fs from 'fs'
import swaggerUi from 'swagger-ui-express'
import swaggerJson from './data/swagger.json'
import { io, Socket } from 'socket.io-client'
import { Server, createServer } from 'http'
import { createAuthSignedMessage } from './utils/messageVerification'
import { SignedMessageDto } from './dto/signedMessage.dto'
import { makeValidateBody } from './middlewares/makeValidateBody'
import { keyShareAdminSignedMessageAuth } from './middlewares/keyShareAdminSignedMessageAuth'
import { validateStringifiedMessage } from './middlewares/validateStringifiedMessage'
import { updatePrivateKey } from './utils/privateKey'
import { Logger } from 'winston'
import initLogger from './utils/logger'
import { defaultWeb3Provider, getKeyShareHolderByAdmin } from './core'
import {
	ConnectTssClientInput,
	DisconnectTssClientInput,
	TypedRequestBody,
	UpdateKeyShareHolderInput
} from './interfaces'
import {
	AuthToken,
	ClientEvent,
	ConnectTssClientParams,
	ServerEvent,
	SignedMsgType
} from '@bitoftrade/tss-core'
import { KeyGenService } from './services/keyGenService'
import { EventSignService } from './services/eventSignService'
import { EventSignDto } from './dto/eventSign.dto'
import { ConnectTssClientDto } from './dto/connectTssClient'
import { DisconnectTssClientDto } from './dto/disconnectTssClient'
import { UpdateKeyShareHolderDto } from './dto/updateValidator.dto'

export class TssClient {
	private logger: Logger
	public app: express.Application
	public server: Server
	private io: Socket

	private port: number = env.PORT

	private keyGenProcesses: Map<string, KeyGenService> = new Map()
	private eventSignProcesses: Map<string, EventSignService> = new Map()

	constructor() {
		this.logger = initLogger('Client')
		this.initHttpServer()
		if (env.AUTO_CONNECT) {
			this.connect()
		}
	}

	private async initSocket(): Promise<void> {
		this.io = io(env.SERVER_URL, {
			auth: (cb) => cb(this.getAuthToken()),
			reconnection: true,
			autoConnect: true
		})
		this.listen()
	}

	private connect(): void {
		this.logger.info('Init socket connect')
		this.initSocket()
	}

	private connectionStatus(): boolean {
		return !!this?.io?.connected
	}

	private disconnect(): void {
		this.logger.info('Init socket disconnect')
		this.io.removeAllListeners()
		this.io.disconnect()
	}

	private initHttpServer(): void {
		this.app = express()
		this.app.use(express.json())
		this.app.use(cors())
		this.app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerJson))
		this.app.options('*', cors())
		this.server = createServer(this.app)
		this.initHttpRoutes()
	}

	private initHttpRoutes(): void {
		this.server.listen(this.port, () => {
			this.logger.info(`Running server on port ${this.port}`)
		})

		this.app.get('/ping', (req, res) => {
			res.json({ ping: 'pong' })
		})

		this.app.get('/key-shares-list', (req, res) => {
			res.json(fs.readdirSync('./tss-key-shares'))
		})

		this.app.get('/connection-status', (req, res) => {
			res.json(this.connectionStatus())
		})

		this.app.get('/key-share-holder-address', (req, res) => {
			// use only process.env.KEY_SHARE_HOLDER_PRIVATE_KEY
			res.json(
				defaultWeb3Provider.eth.accounts.privateKeyToAccount(process.env.KEY_SHARE_HOLDER_PRIVATE_KEY).address
			)
		})

		this.app.get('/key-share-admin-address', (req, res) => {
			res.send(env.KEY_SHARE_ADMIN)
		})

		this.app.post(
			'/connect',
			makeValidateBody(SignedMessageDto),
			keyShareAdminSignedMessageAuth(),
			validateStringifiedMessage(ConnectTssClientDto),
			async (req: TypedRequestBody<ConnectTssClientInput>, res) => {
				try {
					if (this.connectionStatus()) {
						res.status(400).send('TssClient is already connected')
					} else {
						this.connect()
						res.status(200).send('Connected')
					}
				} catch (e) {
					res.status(400).json({
						error: true,
						message: e.message
					})
				}
			}
		)

		this.app.post(
			'/disconnect',
			makeValidateBody(SignedMessageDto),
			keyShareAdminSignedMessageAuth(),
			validateStringifiedMessage(DisconnectTssClientDto),
			async (req: TypedRequestBody<DisconnectTssClientInput>, res) => {
				try {
					if (!this.connectionStatus()) {
						res.status(400).send('TssClient is already disconnected')
					} else {
						this.disconnect()
						res.status(200).send('Disconnected')
					}
				} catch (e) {
					res.status(400).json({
						error: true,
						message: e.message
					})
				}
			}
		)

		this.app.post(
			'/update-key-share-holder',
			makeValidateBody(SignedMessageDto),
			keyShareAdminSignedMessageAuth(),
			validateStringifiedMessage(UpdateKeyShareHolderDto),
			async (req: TypedRequestBody<UpdateKeyShareHolderInput>, res) => {
				try {
					const prKey = req.body.params.prKey
					const keyShareHolder = await getKeyShareHolderByAdmin(env.KEY_SHARE_ADMIN)
					const addressFromPrKey = defaultWeb3Provider.eth.accounts.privateKeyToAccount(prKey)?.address
					if (keyShareHolder.toLowerCase() !== addressFromPrKey.toLowerCase()) {
						res.status(400).send(`KeyShareHolder address doesn't correspond to KeyShareManager`)
						return
					}
					await updatePrivateKey(prKey)
					res.status(200).send('Private key was updated')
				} catch (e) {
					res.status(400).json({
						error: true,
						message: e.message
					})
				}
			}
		)
	}

	getAuthToken(): AuthToken {
		const clientId = env.KEY_SHARE_ADMIN.toLowerCase()
		const messageParams: ConnectTssClientParams = {
			type: SignedMsgType.CONNECT_TSS_CLIENT,
			// msg valid only for one hour
			expiryTime: new Date().getTime() + 60 * 60 * 1000,
			keyShareManagerAddress: env.KEY_SHARE_MANAGER_ADDRESS,
			keyShareManagerChainId: env.KEY_SHARE_MANAGER_CHAIN_ID,
			adminGnosisSafeAddress: env.ADMIN_GNOSIS_SAFE_ADDRESS,
			adminGnosisSafeChainId: env.ADMIN_GNOSIS_SAFE_CHAIN_ID,
			availableChains: env.AVAILABLE_CHAINS
		}
		const message = JSON.stringify(messageParams)
		const signedMessage = createAuthSignedMessage(message)
		return {
			r: signedMessage.r,
			s: signedMessage.s,
			v: signedMessage.v,
			message,
			keyShareAdmin: clientId
		}
	}

	private listen(): void {
		this.io.on(ClientEvent.CONNECT_ERROR, (error) => {
			this.logger.error(`Connection Failed: ${error.message}`)
		})

		this.io.on(ClientEvent.CONNECT, () => {
			this.logger.info('Connected to server')
		})

		this.io.on(ClientEvent.DISCONNECT, () => {
			this.logger.info('Disconnected from server')
		})

		this.listenKeyGenEvents()
		this.listenEventSignEvents()
	}

	listenKeyGenEvents(): void {
		this.io.on(ServerEvent.KEY_GEN_INIT, (processId: string, msg: string, txHash: string, port: string) =>
			this.createKeyGenProcess(processId, msg, txHash, port)
		)
		this.io.on(ServerEvent.KEY_GEN_STOP, (processId: string) => this.stopKeyGen(processId))
		this.io.on(ServerEvent.KEY_GEN_START, (processId: string) => this.startKeyGen(processId))
		this.io.on(ServerEvent.KEY_GEN_INIT_MSG_SIGN, (processId: string, indexes: number[]) =>
			this.startKeyGenMsgSigning(processId, indexes)
		)
		this.io.on(ServerEvent.KEY_GEN_NEW_SIGNER_ADDRESS, (processId: string, address: string) =>
			this.setNewTssClientsAddress(processId, address)
		)
	}

	listenEventSignEvents(): void {
		this.io.on(ServerEvent.EVENT_SIGN_INIT, (processId: string, eventSign: EventSignDto, port: string) =>
			this.createEventSignProcess(processId, eventSign, port)
		)
		this.io.on(ServerEvent.EVENT_SIGN_START, (processId: string, indexes) =>
			this.startEventSign(processId, indexes)
		)
		this.io.on(ServerEvent.EVENT_SIGN_STOP, (processId: string) => this.stopEventSign(processId))
	}

	createKeyGenProcess(processId: string, msg: string, txHash: string, port: string): void {
		const service = new KeyGenService(processId, this.io, Number(port))
		service.initKeyGen(msg, txHash)
		this.keyGenProcesses.set(processId, service)
	}

	startKeyGen(processId: string): void {
		const service = this.keyGenProcesses.get(processId)
		service.startKeyGen()
	}

	startKeyGenMsgSigning(processId: string, indexes: number[]): void {
		const service = this.keyGenProcesses.get(processId)
		service.startKeyGenMsgSigning(indexes)
	}

	setNewTssClientsAddress(processId: string, address): void {
		const service = this.keyGenProcesses.get(processId)
		service.setNewTssClientsAddress(address)
		this.keyGenProcesses.delete(processId)
	}

	stopKeyGen(processId: string): void {
		this.logger.info(`Process with id: ${processId} was stopped`)
		this.keyGenProcesses.delete(processId)
	}

	createEventSignProcess(processId: string, eventSign: EventSignDto, port: string): void {
		const service = new EventSignService(processId, this.io, Number(port))
		service.initEventSign(eventSign)
		this.eventSignProcesses.set(processId, service)
	}

	startEventSign(processId: string, indexes: number[]): void {
		const service = this.eventSignProcesses.get(processId)
		service.startEventSign(indexes)
	}

	stopEventSign(processId: string): void {
		this.logger.info(`Process with id: ${processId} was stopped`)
		this.eventSignProcesses.delete(processId)
	}
}
