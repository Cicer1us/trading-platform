import { Module, ModuleMetadata } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MerchantsModule } from '../merchants/merchants.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ApiKeyStrategy } from './strategy/api-key.strategy';
import { MailerModule } from 'src/mailer/mailer.module';
import { PrismaService } from 'src/prisma/prisma.service';

export const authModuleMetadata: ModuleMetadata = {
  imports: [
    PassportModule,
    JwtModule.register({}),
    MerchantsModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ApiKeyStrategy, PrismaService],
};
@Module(authModuleMetadata)
export class AuthModule {}
