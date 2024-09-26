import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class StatsSwapsDto {
	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	initiator?: string

	@ApiProperty({ required: true })
	@Type(() => Number)
	@IsNumber()
	@IsOptional()
	chainId?: number

	@ApiProperty({ required: false })
	@IsArray({ each: true })
	@IsOptional()
	initiators?: string[]

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	srcToken?: string

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	destToken?: string

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	withoutVolumes?: boolean

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	dateFrom?: string

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	dateTo?: string

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	includeInitiators?: boolean
}
