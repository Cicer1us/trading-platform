import { SignedMsgType, KeyGenParams } from '@bitoftrade/tss-core'
import { IsLessThan } from '@src/utils/decorators'
import { IsIn, IsNumber, Min } from 'class-validator'

export class StartKeyGenDto implements KeyGenParams {
	@IsNumber()
	@IsLessThan('parties', { message: 'threshold should be less then parties' })
	@Min(1)
	threshold: number

	@IsNumber()
	@Min(2)
	parties: number

	@IsIn([SignedMsgType.KEY_GEN])
	type: SignedMsgType.KEY_GEN
}
