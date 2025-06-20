import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CertificadoPdaService } from './certificado-pda.service';
import { CreateCertificadoPdaDto } from './dto/create-certificado-pda.dto';
import { UpdateCertificadoPdaDto } from './dto/update-certificado-pda.dto';

@Controller('certificado-pda')
export class CertificadoPdaController {
  constructor(private readonly certificadoPdaService: CertificadoPdaService) {}

  @Post()
  create(@Body() createCertificadoPdaDto: CreateCertificadoPdaDto) {
    return this.certificadoPdaService.create(createCertificadoPdaDto);
  }

  @Get()
  findAll() {
    return this.certificadoPdaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.certificadoPdaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCertificadoPdaDto: UpdateCertificadoPdaDto) {
    return this.certificadoPdaService.update(+id, updateCertificadoPdaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.certificadoPdaService.remove(+id);
  }
}
