import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { mailerModuleMetadata } from './mailer.module';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      mailerModuleMetadata,
    ).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
