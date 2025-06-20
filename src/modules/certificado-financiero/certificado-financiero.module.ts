import { Module } from '@nestjs/common';
import { CertificadoFinancieroService } from './certificado-financiero.service';
import { CertificadoFinancieroController } from './certificado-financiero.controller';

@Module({
  controllers: [CertificadoFinancieroController],
  providers: [CertificadoFinancieroService],
})
export class CertificadoFinancieroModule {}
