import env from '@src/utils/env.validation'
import initLogger from '@src/utils/logger'
import { Socket } from 'socket.io-client'
import { Logger } from 'winston'
import { ClientEvent, DEFAULT_MESSAGE_TO_SIGN } from '@bitoftrade/tss-core'
import {
	defaultWeb3Provider,
	getKeyShareAdminIndexOrReject,
	verifyGnosisSafeAdminSignedMessageOrReject
} from '@src/core'
import { KeyGenParamsDto } from '@src/dto/keyGenParams.dto'
import {
	renameTempKeyFile,
	startKeyGenClient,
	startMsgSignClient,
	waitForKeyGeneration,
	waitForSignatureGeneration
} from '@src/services/gg20Manager'
import { transformAndValidate } from 'class-transformer-validator'

export class KeyGenService {
	private logger: Logger
	private keyGenParams: KeyGenParamsDto = null

	constructor(private processId: string, private io: Socket, private port: number) {
		this.logger = initLogger(`KeyGenService (${processId})`)
	}

	async initKeyGen(msg: string, txHash: string): Promise<void> {
		this.logger.info('initKeyGen')
		try {
			await verifyGnosisSafeAdminSignedMessageOrReject(msg, txHash)
			const json = JSON.parse(msg)
			this.keyGenParams = (await transformAndValidate(KeyGenParamsDto, json)) as KeyGenParamsDto
			this.emit(ClientEvent.KEY_GEN_READY)
		} catch (e) {
			this.logger.error(e)
			this.emit(ClientEvent.KEY_GEN_ERROR, e)
		}
	}

	async startKeyGen(): Promise<void> {
		this.logger.info('startKeyGen')
		if (this.keyGenParams) {
			try {
				const index = await getKeyShareAdminIndexOrReject(env.KEY_SHARE_ADMIN)

				await startKeyGenClient(
					this.keyGenParams.parties,
					this.keyGenParams.threshold,
					index,
					this.port,
					this.processId
				)
				this.emit(ClientEvent.KEY_GEN_WAIT_FOR_OTHER_TO_START)

				await waitForKeyGeneration(this.processId)

				this.emit(ClientEvent.KEY_GEN_FINISHED)
			} catch (e) {
				this.logger.error(`error start key gen: ${e}`)
				this.keyGenParams = null
				this.emit(ClientEvent.KEY_GEN_ERROR, e)
			}
		}
	}

	async startKeyGenMsgSigning(indexes: number[]): Promise<void> {
		this.logger.info('startKeyGenMsgSigning')
		if (this.keyGenParams) {
			try {
				const messageHash = defaultWeb3Provider.eth.accounts.hashMessage(DEFAULT_MESSAGE_TO_SIGN)
				await startMsgSignClient(messageHash, indexes, this.port, this.processId, this.processId)
				this.emit(ClientEvent.KEY_GEN_WAIT_FOR_OTHER_TO_SIGN)
				const signature = await waitForSignatureGeneration(this.processId)
				const address = defaultWeb3Provider.eth.accounts.recover({ messageHash, ...signature })
				this.emit(ClientEvent.KEY_GEN_SIGNED_MSG_ADDRESS, address.toLowerCase())
				this.keyGenParams = null
			} catch (e) {
				this.logger.error(`error msg sign: ${e}`)
				this.emit(ClientEvent.KEY_GEN_ERROR, e)
			}
		}
	}

	emit(event: ClientEvent, ...args: string[]): void {
		this.io.emit(event, this.processId, ...args)
	}

	async setNewTssClientsAddress(address: string): Promise<void> {
		this.logger.info('setNewTssClientsAddress')
		await renameTempKeyFile(this.processId, address)
	}
}
