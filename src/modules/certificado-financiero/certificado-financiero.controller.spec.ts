import { Test, TestingModule } from '@nestjs/testing';
import { CertificadoFinancieroController } from './certificado-financiero.controller';
import { CertificadoFinancieroService } from './certificado-financiero.service';

describe('CertificadoFinancieroController', () => {
  let controller: CertificadoFinancieroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificadoFinancieroController],
      providers: [CertificadoFinancieroService],
    }).compile();

    controller = module.get<CertificadoFinancieroController>(CertificadoFinancieroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
