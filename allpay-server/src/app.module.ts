import { Module } from '@nestjs/common';
import { MerchantsModule } from './merchants/merchants.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import ConfigModule from './config/config.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    MerchantsModule,
    PaymentsModule,
    MailerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
