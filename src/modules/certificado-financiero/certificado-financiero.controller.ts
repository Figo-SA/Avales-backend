import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CertificadoFinancieroService } from './certificado-financiero.service';
import { CreateCertificadoFinancieroDto } from './dto/create-certificado-financiero.dto';
import { UpdateCertificadoFinancieroDto } from './dto/update-certificado-financiero.dto';

@Controller('certificado-financiero')
export class CertificadoFinancieroController {
  constructor(private readonly certificadoFinancieroService: CertificadoFinancieroService) {}

  @Post()
  create(@Body() createCertificadoFinancieroDto: CreateCertificadoFinancieroDto) {
    return this.certificadoFinancieroService.create(createCertificadoFinancieroDto);
  }

  @Get()
  findAll() {
    return this.certificadoFinancieroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificadoFinancieroService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCertificadoFinancieroDto: UpdateCertificadoFinancieroDto) {
    return this.certificadoFinancieroService.update(+id, updateCertificadoFinancieroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificadoFinancieroService.remove(+id);
  }
}
