import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { paymentsModuleMetadata } from './payments.module';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule(
      paymentsModuleMetadata,
    ).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
