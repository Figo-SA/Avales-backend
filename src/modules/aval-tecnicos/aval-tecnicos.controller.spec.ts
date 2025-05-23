import { Test, TestingModule } from '@nestjs/testing';
import { AvalTecnicosController } from './aval-tecnicos.controller';
import { AvalTecnicosService } from './aval-tecnicos.service';

describe('AvalTecnicosController', () => {
  let controller: AvalTecnicosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvalTecnicosController],
      providers: [AvalTecnicosService],
    }).compile();

    controller = module.get<AvalTecnicosController>(AvalTecnicosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
