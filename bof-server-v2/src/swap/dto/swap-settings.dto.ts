import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export default class SwapSettingsDto {
	@ApiProperty()
	@IsString()
	partnerAddress: string

	@ApiProperty()
	@IsString()
	feePercentage: number
}
