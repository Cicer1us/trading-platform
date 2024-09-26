import { IsString } from 'class-validator'

export class SignedMessageDto {
	@IsString()
	message: string

	@IsString()
	signature: string
}
