import { Test, TestingModule } from '@nestjs/testing';
import { RevisionDtmController } from './revision-dtm.controller';
import { RevisionDtmService } from './revision-dtm.service';

describe('RevisionDtmController', () => {
  let controller: RevisionDtmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevisionDtmController],
      providers: [RevisionDtmService],
    }).compile();

    controller = module.get<RevisionDtmController>(RevisionDtmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
