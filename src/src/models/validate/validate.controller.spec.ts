import { Test, TestingModule } from '@nestjs/testing';
import { ValidateController } from './validate.controller';
import { ValidateService } from './validate.service';

describe('ValidateController', () => {
  let controller: ValidateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidateController],
      providers: [ValidateService],
    }).compile();

    controller = module.get<ValidateController>(ValidateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
