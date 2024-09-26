import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class CreateAffiliatedUserDto {
	@ApiProperty()
	@IsString()
	clientAddress: string

	@ApiProperty()
	@IsString()
	affiliateId: string
}
