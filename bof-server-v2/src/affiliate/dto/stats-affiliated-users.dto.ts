import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class StatsAffiliatedUsersDto {
	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	srcToken?: string

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	destToken?: string

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	clientAddress?: string

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	dateFrom?: string

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	dateTo?: string
}
