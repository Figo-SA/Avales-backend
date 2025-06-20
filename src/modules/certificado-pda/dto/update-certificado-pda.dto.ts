import { PartialType } from '@nestjs/swagger';
import { CreateCertificadoPdaDto } from './create-certificado-pda.dto';

export class UpdateCertificadoPdaDto extends PartialType(CreateCertificadoPdaDto) {}
