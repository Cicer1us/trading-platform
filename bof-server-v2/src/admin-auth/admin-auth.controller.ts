import { Body, Controller, Post } from '@nestjs/common'
import { AdminAuthService } from './admin-auth.service'
import { LoginDto } from './dto/login.dto'
import { RegistrationDto } from './dto/registration.dto'
import { ApiTags } from '@nestjs/swagger'
import { UpdateResult } from 'typeorm'

@ApiTags('admin-auth')
@Controller('admin-auth')
export class AdminAuthController {
	constructor(private readonly adminAuthService: AdminAuthService) {}

	@Post('/sign-in')
	login(@Body() loginDto: LoginDto): Promise<string> {
		return this.adminAuthService.signIn(loginDto)
	}

	@Post('/register')
	registration(@Body() registrationDto: RegistrationDto): Promise<UpdateResult> {
		return this.adminAuthService.register(registrationDto)
	}
}
