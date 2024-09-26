import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator'

export class CreateAffiliateDto {
	@ApiProperty()
	@IsString()
	name: string

	@ApiProperty()
	@IsOptional()
	@IsString()
	companyName?: string

	@ApiProperty()
	@IsOptional()
	@IsEmail()
	email?: string

	@ApiProperty()
	@IsOptional()
	@IsPhoneNumber()
	phone?: string
}
