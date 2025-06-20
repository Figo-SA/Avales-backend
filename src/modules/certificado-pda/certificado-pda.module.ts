import { Module } from '@nestjs/common';
import { CertificadoPdaService } from './certificado-pda.service';
import { CertificadoPdaController } from './certificado-pda.controller';

@Module({
  controllers: [CertificadoPdaController],
  providers: [CertificadoPdaService],
})
export class CertificadoPdaModule {}
