import { Test, TestingModule } from '@nestjs/testing';
import { CertificadoPdaController } from './certificado-pda.controller';
import { CertificadoPdaService } from './certificado-pda.service';

describe('CertificadoPdaController', () => {
  let controller: CertificadoPdaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificadoPdaController],
      providers: [CertificadoPdaService],
    }).compile();

    controller = module.get<CertificadoPdaController>(CertificadoPdaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
