import { ApiProperty } from '@nestjs/swagger'

export class UsersCountDto {
	@ApiProperty()
	uniqueUsersCount: number

	@ApiProperty()
	users: string[]
}
