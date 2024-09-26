import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { LimitOrderStatus } from '../entities/limit-order.entity'

export class SearchTradedLimitTokensDto {
	@ApiProperty({ enum: LimitOrderStatus })
	@IsEnum(LimitOrderStatus)
	status: LimitOrderStatus

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	dateFrom?: string

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	dateTo?: string
}
