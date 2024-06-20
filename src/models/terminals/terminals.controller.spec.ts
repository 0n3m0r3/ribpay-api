import { Test, TestingModule } from '@nestjs/testing';
import { TerminalsController } from './terminals.controller';
import { TerminalsService } from './terminals.service';

describe('TerminalsController', () => {
  let controller: TerminalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TerminalsController],
      providers: [TerminalsService],
    }).compile();

    controller = module.get<TerminalsController>(TerminalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
