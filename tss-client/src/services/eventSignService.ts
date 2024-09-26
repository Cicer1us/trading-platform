import initLogger from '@src/utils/logger'
import { transformAndValidate } from 'class-transformer-validator'
import { Socket } from 'socket.io-client'
import { Logger } from 'winston'
import { ClientEvent } from '@bitoftrade/tss-core'
import { getCurrentSigner, verifyAndParseEventOrReject } from '@src/core'
import concatSignature from '@src/utils/concatSignature'
import {
	getApproveSignParamsForSigner,
	startMsgSignClient,
	waitForSignatureGeneration
} from '@src/services/gg20Manager'
import { EventSignDto } from '@src/dto/eventSign.dto'

export class EventSignService {
	private logger: Logger
	private eventSign: EventSignDto = null
	private eventHash = ''

	constructor(private processId: string, private io: Socket, private port: number) {
		this.logger = initLogger(`EventSignService (${processId})`)
	}

	async initEventSign(eventSign: EventSignDto): Promise<void> {
		this.logger.info('initEventSign')
		try {
			await transformAndValidate(EventSignDto, eventSign)
			const currentSigner = await getCurrentSigner()
			const signerParams = await getApproveSignParamsForSigner(currentSigner)
			const parsedEvent = await verifyAndParseEventOrReject(
				eventSign.chainId,
				eventSign.txHash,
				eventSign.abi,
				eventSign.eventLogIndex
			)

			if (!signerParams) {
				this.logger.warn(`decline event sign check`)
				this.emit(ClientEvent.EVENT_SIGN_DECLINE)
			} else {
				this.emit(ClientEvent.EVENT_SIGN_APPROVE, signerParams)
				this.eventHash = parsedEvent.paramsHash
				this.eventSign = eventSign
			}
		} catch (error) {
			this.logger.error(`decline event tx check: ${error}`)
			// TODO: change to event sign error
			this.emit(ClientEvent.EVENT_SIGN_DECLINE)
		}
	}

	async startEventSign(indexes: number[]): Promise<void> {
		this.logger.info('startEventSign')
		if (this.eventSign) {
			try {
				const currentSigner = await getCurrentSigner()

				await startMsgSignClient(this.eventHash, indexes, this.port, currentSigner, this.processId)

				this.emit(ClientEvent.EVENT_SIGN_WAIT_FOR_OTHER_TO_SIGN)

				const signature = await waitForSignatureGeneration(this.processId)
				const concatedSignature = concatSignature(signature)

				this.emit(ClientEvent.EVENT_SIGN_SIGNATURE, concatedSignature)
				this.eventSign = null
				this.eventHash = ''
			} catch (error) {
				this.logger.error(`decline event sign: ${error}`)
				// TODO: change to event sign error
				this.emit(ClientEvent.EVENT_SIGN_DECLINE)
			}
		}
	}

	emit(event: ClientEvent, ...args: unknown[]): void {
		this.io.emit(event, this.processId, ...args)
	}
}
