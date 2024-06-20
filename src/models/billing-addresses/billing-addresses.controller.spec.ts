import { Test, TestingModule } from '@nestjs/testing';
import { BillingAddressesController } from './billing-addresses.controller';
import { BillingAddressesService } from './billing-addresses.service';

describe('BillingAddressesController', () => {
  let controller: BillingAddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingAddressesController],
      providers: [BillingAddressesService],
    }).compile();

    controller = module.get<BillingAddressesController>(BillingAddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
