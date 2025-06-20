import { Injectable } from '@nestjs/common';
import { CreateCertificadoFinancieroDto } from './dto/create-certificado-financiero.dto';
import { UpdateCertificadoFinancieroDto } from './dto/update-certificado-financiero.dto';

@Injectable()
export class CertificadoFinancieroService {
  create(createCertificadoFinancieroDto: CreateCertificadoFinancieroDto) {
    return 'This action adds a new certificadoFinanciero';
  }

  findAll() {
    return `This action returns all certificadoFinanciero`;
  }

  findOne(id: number) {
    return `This action returns a #${id} certificadoFinanciero`;
  }

  update(id: number, updateCertificadoFinancieroDto: UpdateCertificadoFinancieroDto) {
    return `This action updates a #${id} certificadoFinanciero`;
  }

  remove(id: number) {
    return `This action removes a #${id} certificadoFinanciero`;
  }
}
