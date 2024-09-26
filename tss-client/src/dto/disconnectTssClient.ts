import { SignedMsgType } from '@bitoftrade/tss-core'
import { IsNotExpired } from '@src/utils/isNotExpired.decorator'
import { IsIn, IsNumber } from 'class-validator'

export class DisconnectTssClientDto {
	@IsNumber()
	@IsNotExpired()
	expiryTime: number

	@IsIn([SignedMsgType.DISCONNECT_TSS_CLIENT])
	type: SignedMsgType.DISCONNECT_TSS_CLIENT
}
