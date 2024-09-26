import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class SearchLimitOrderDto {
	@ApiProperty({ required: true })
	@IsString()
	address: string
}
