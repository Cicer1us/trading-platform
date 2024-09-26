import { IsString, Matches } from 'class-validator'

export class GnosisSafeAuthDto {
	@IsString()
	message: string

	@Matches(/^0x([A-Fa-f0-9]{64})$/, { message: 'Invalid transaction hash' })
	txHash: string
}
