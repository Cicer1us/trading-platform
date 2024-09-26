import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class SearchTradedTokensDto {
	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	dateFrom?: string

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	dateTo?: string

	@ApiProperty({ required: true })
	@Type(() => Number)
	@IsNumber()
	chainId: number
}
