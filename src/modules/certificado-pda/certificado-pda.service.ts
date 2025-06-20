import { Injectable } from '@nestjs/common';
import { CreateCertificadoPdaDto } from './dto/create-certificado-pda.dto';
import { UpdateCertificadoPdaDto } from './dto/update-certificado-pda.dto';

@Injectable()
export class CertificadoPdaService {
  create(createCertificadoPdaDto: CreateCertificadoPdaDto) {
    return 'This action adds a new certificadoPda';
  }

  findAll() {
    return `This action returns all certificadoPda`;
  }

  findOne(id: number) {
    return `This action returns a #${id} certificadoPda`;
  }

  update(id: number, updateCertificadoPdaDto: UpdateCertificadoPdaDto) {
    return `This action updates a #${id} certificadoPda`;
  }

  remove(id: number) {
    return `This action removes a #${id} certificadoPda`;
  }
}
