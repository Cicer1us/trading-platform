import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { LimitOrderStatus } from '../entities/limit-order.entity'

export class StatsLimitOrderDto {
	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	maker?: string

	@ApiProperty({ required: false })
	@IsArray({ each: true })
	@IsOptional()
	makers?: string[]

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	makerToken?: string

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	takerToken?: string

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	dateFrom?: string

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	dateTo?: string

	@ApiProperty({ enum: LimitOrderStatus })
	@IsEnum(LimitOrderStatus)
	status: LimitOrderStatus

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	includeMakers?: boolean

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	withoutVolumes?: boolean
}
