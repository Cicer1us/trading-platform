import cors from 'cors'
import express from 'express'
import { TssManagerService } from './services/tssManagerService'
import { Server, createServer } from 'http'
import swaggerUi from 'swagger-ui-express'
import swaggerJson from './data/swagger.json'
import env from './utils/env.validation'
import { makeValidateBody } from './middleware/makeValidateBody'
import { gnosisSafeAuth } from './middleware/gnosisSafeAuth'
import { validateStringifiedMessage } from './middleware/validateStringifiedMessage'
import { StartKeyGenDto } from './dto/startKeyGenDto'
import { GnosisSafeAuthDto } from './dto/gnosisSafeAuthDto'
import { TypedRequestBody, StartKeygenInput } from './interfaces'
import { checkAlreadyHandledSignedMessage } from './middleware/checkHandledSignedMessage'
import { Logger } from 'winston'
import initLogger from './utils/logger'
import { EventSignDto } from './dto/eventSignDto'
import { getCurrentSigner } from './core'

export class TssServer {
	public app: express.Application
	public server: Server
	private port: number = env.PORT
	private logger: Logger

	private tssService: TssManagerService

	constructor() {
		this.logger = initLogger('server')
		this.initHttpServer()
		this.tssService = new TssManagerService(this.server)
	}

	initHttpServer(): void {
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

		this.app.get('/status', (req, res) => {
			res.json(this.tssService.connectedTssClients())
		})

		this.app.get('/latest-generated-address', (req, res) => {
			res.json(this.tssService.latestGeneratedAddress)
		})

		this.app.get('/metadata', async (req, res) => {
			res.json({
				name: env.SIGNER_NAME,
				availableChains: env.AVAILABLE_CHAINS,
				signer: await getCurrentSigner()
			})
		})

		this.app.post(
			'/start-key-gen',
			makeValidateBody(GnosisSafeAuthDto),
			checkAlreadyHandledSignedMessage(),
			gnosisSafeAuth(),
			validateStringifiedMessage(StartKeyGenDto),
			async (req: TypedRequestBody<StartKeygenInput>, res) => {
				const { params, message, txHash } = req.body
				try {
					await this.tssService.readyToStartKeyGen(params.parties, txHash)
					const address = await this.tssService.startKeyGenProcess(message, txHash, params)
					this.logger.info(`New address was generated: ${address}`)
					res.status(202).json({ address })
				} catch (e) {
					this.logger.error(`Failed to start key gen: ${e.message}`)
					res.status(400).json({
						error: true,
						message: e.message
					})
				}
			}
		)

		this.app.post(
			'/sign-event',
			makeValidateBody(EventSignDto),
			async (req: TypedRequestBody<EventSignDto>, res) => {
				const eventSignDto = req.body
				try {
					await this.tssService.readyToStartEventSign(eventSignDto)
					const { signature, params, paramsHash, signer } = await this.tssService.startEventSignProcess(
						eventSignDto
					)
					res.status(202).json({
						chainId: eventSignDto.chainId,
						txHash: eventSignDto.txHash,
						eventHash: paramsHash,
						signature,
						signer,
						params
					})
				} catch (e) {
					this.logger.error(`Failed to parse and sign event: ${e.message}`)
					res.status(400).json({
						error: true,
						message: e.message
					})
				}
			}
		)
	}
}
