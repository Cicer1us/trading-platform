import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RegistrationDto {
	@ApiProperty()
	@IsString()
	login: string

	@ApiProperty()
	@IsString()
	password: string

	@ApiProperty()
	@IsString()
	pin: string
}
