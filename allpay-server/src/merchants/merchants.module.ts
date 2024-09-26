import { Module, ModuleMetadata } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { PrismaService } from '../prisma/prisma.service';

export const merchantsModuleMetadata: ModuleMetadata = {
  controllers: [MerchantsController],
  providers: [MerchantsService, PrismaService],
  exports: [MerchantsService],
};
@Module(merchantsModuleMetadata)
export class MerchantsModule {}
