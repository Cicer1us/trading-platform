import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator'

export class LeverageTradeSearchParamsDto {
	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	userAddress?: string

	@ApiProperty({ required: false, isArray: true })
	@IsArray()
	@IsOptional()
	userAddressArray?: string[]

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	market?: string

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	dateFrom?: string

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	dateTo?: string

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	includeUserAddress?: boolean
}
