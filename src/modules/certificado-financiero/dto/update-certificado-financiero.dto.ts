import { PartialType } from '@nestjs/swagger';
import { CreateCertificadoFinancieroDto } from './create-certificado-financiero.dto';

export class UpdateCertificadoFinancieroDto extends PartialType(CreateCertificadoFinancieroDto) {}
