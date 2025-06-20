import { Test, TestingModule } from '@nestjs/testing';
import { CertificadoPdaService } from './certificado-pda.service';

describe('CertificadoPdaService', () => {
  let service: CertificadoPdaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CertificadoPdaService],
    }).compile();

    service = module.get<CertificadoPdaService>(CertificadoPdaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
