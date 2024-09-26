import { SignedMsgType } from '@bitoftrade/tss-core'
import { IsNotExpired } from '@src/utils/isNotExpired.decorator'
import { IsIn, IsNumber, IsString, Length } from 'class-validator'

export class UpdateKeyShareHolderDto {
	@IsNumber()
	@IsNotExpired()
	expiryTime: number

	@IsString()
	@Length(64, 64)
	prKey: string

	@IsIn([SignedMsgType.UPDATE_KEY_SHARE_HOLDER])
	type: SignedMsgType.UPDATE_KEY_SHARE_HOLDER
}
