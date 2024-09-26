import { Test, TestingModule } from '@nestjs/testing';
import { MerchantsService } from './merchants.service';
import { merchantsModuleMetadata } from './merchants.module';

describe('MerchantsService', () => {
  let service: MerchantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      merchantsModuleMetadata,
    ).compile();

    service = module.get<MerchantsService>(MerchantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
