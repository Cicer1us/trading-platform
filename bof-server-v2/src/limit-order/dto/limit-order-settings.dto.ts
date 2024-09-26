import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export default class LimitOrderSettingsDto {
	@ApiProperty()
	@IsString()
	partnerAddress: string

	@ApiProperty()
	@IsString()
	feePercentage: number
}
