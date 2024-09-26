import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class SearchSwapsDto {
	@ApiProperty()
	@IsString()
	initiator: string

	@ApiProperty()
	@IsNumber()
	@Type(() => Number)
	chainId: number

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
	dateFrom?: string

	@ApiProperty({ required: false })
	@IsString()
	@IsOptional()
	dateTo?: string
}
