import { Test, TestingModule } from '@nestjs/testing';
import { CertificadoFinancieroService } from './certificado-financiero.service';

describe('CertificadoFinancieroService', () => {
  let service: CertificadoFinancieroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertificadoFinancieroService],
    }).compile();

    service = module.get<CertificadoFinancieroService>(CertificadoFinancieroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
