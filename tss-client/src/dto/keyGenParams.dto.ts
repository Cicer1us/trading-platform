import { SignedMsgType } from '@bitoftrade/tss-core'
import { IsIn, IsNumber } from 'class-validator'

export class KeyGenParamsDto implements KeyGenParamsDto {
	@IsNumber()
	threshold: number

	@IsNumber()
	parties: number

	@IsIn([SignedMsgType.KEY_GEN])
	type: SignedMsgType.KEY_GEN
}
