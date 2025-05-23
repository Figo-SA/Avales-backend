import { Test, TestingModule } from '@nestjs/testing';
import { AvalTecnicosService } from './aval-tecnicos.service';

describe('AvalTecnicosService', () => {
  let service: AvalTecnicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvalTecnicosService],
    }).compile();

    service = module.get<AvalTecnicosService>(AvalTecnicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
