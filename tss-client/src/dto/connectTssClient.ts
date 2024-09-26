import { SignedMsgType } from '@bitoftrade/tss-core'
import { IsNotExpired } from '@src/utils/isNotExpired.decorator'
import { IsIn, IsNumber } from 'class-validator'

export class ConnectTssClientDto {
	@IsNumber()
	@IsNotExpired()
	expiryTime: number

	@IsIn([SignedMsgType.CONNECT_TSS_CLIENT])
	type: SignedMsgType.CONNECT_TSS_CLIENT
}
