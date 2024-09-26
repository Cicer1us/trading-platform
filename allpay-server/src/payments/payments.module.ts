import { Module, ModuleMetadata } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';
import { MerchantsModule } from 'src/merchants/merchants.module';
import { PaymentsListenerService } from './payments-listener.service';
import { ScheduleModule } from '@nestjs/schedule';

export const paymentsModuleMetadata: ModuleMetadata = {
  imports: [HttpModule, MerchantsModule, ScheduleModule.forRoot()],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsListenerService, PrismaService],
};

@Module(paymentsModuleMetadata)
export class PaymentsModule {}
