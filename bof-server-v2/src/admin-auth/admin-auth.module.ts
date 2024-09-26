import { Module } from '@nestjs/common'
import { AdminAuthService } from './admin-auth.service'
import { AdminAuthController } from './admin-auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { HttpModule } from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Admin } from './admin.entity'
import { JwtStrategy } from './jwt.strategy'

@Module({
	imports: [
		TypeOrmModule.forFeature([Admin]),
		HttpModule,
		PassportModule,
		JwtModule.register({ secret: `${process.env.JWT_SECRET_KEY}` })
	],
	controllers: [AdminAuthController],
	providers: [AdminAuthService, JwtStrategy],
	exports: [AdminAuthService, PassportModule, JwtModule]
})
export class AdminAuthModule {}
