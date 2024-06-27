import { Test, TestingModule } from '@nestjs/testing';
import { BillingAddressesService } from './billing-addresses.service';

describe('BillingAddressesService', () => {
  let service: BillingAddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingAddressesService],
    }).compile();

    service = module.get<BillingAddressesService>(BillingAddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
