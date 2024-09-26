import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';

export const mailerModuleMetadata = {
  providers: [MailerService, PrismaService],
  exports: [MailerService],
};

@Module(mailerModuleMetadata)
export class MailerModule {}
