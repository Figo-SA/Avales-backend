import { Test, TestingModule } from '@nestjs/testing';
import { RevisionDtmService } from './revision-dtm.service';

describe('RevisionDtmService', () => {
  let service: RevisionDtmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevisionDtmService],
    }).compile();

    service = module.get<RevisionDtmService>(RevisionDtmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
