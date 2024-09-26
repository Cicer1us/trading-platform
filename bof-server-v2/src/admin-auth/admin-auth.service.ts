import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { createHash } from 'crypto'
import { LoginDto } from './dto/login.dto'
import { HttpService } from '@nestjs/axios'
import { Repository, UpdateResult } from 'typeorm'
import { Admin } from './admin.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { RegistrationDto } from './dto/registration.dto'

@Injectable()
export class AdminAuthService {
	constructor(
		private jwtService: JwtService,
		private httpService: HttpService,
		@InjectRepository(Admin)
		private readonly adminRepository: Repository<Admin>
	) {}

	authenticatorValidateUrl = 'https://www.authenticatorApi.com/Validate.aspx'

	async signIn(loginDto: LoginDto): Promise<string> {
		const password = createHash('sha512').update(loginDto.password, 'utf8').digest('hex').toString()

		await this.validatePin(loginDto.pin)

		const admin = await this.adminRepository.findOne({ login: loginDto.login })
		if (!admin) {
			throw new UnauthorizedException('Wrong login')
		}
		if (password === admin?.password) {
			return this.jwtService.sign({ login: admin.login }, { expiresIn: '2h' })
		} else {
			throw new UnauthorizedException('Wrong password')
		}
	}

	async register(registrationDto: RegistrationDto): Promise<UpdateResult> {
		const admin = await this.adminRepository.findOne({ login: registrationDto.login })
		if (!admin || admin.password.length) {
			throw new UnauthorizedException('Password already set or user not exist')
		}
		await this.validatePin(registrationDto.pin)

		const password = createHash('sha512').update(registrationDto.password, 'utf8').digest('hex').toString()

		return this.adminRepository.update(admin.id, {
			password: password
		})
	}

	async validatePin(pin: string): Promise<void> {
		const params = new URLSearchParams({
			pin: pin,
			secretCode: process.env.AUTHENTICATOR_APP_SECRET
		})

		const url = `${this.authenticatorValidateUrl}?${params.toString()}`
		const res = await this.httpService.axiosRef.get(url)

		if (res.data === 'True') {
			return
		} else {
			throw new UnauthorizedException('Wrong pin')
		}
	}
}
