import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AvalTecnicosService } from './aval-tecnicos.service';
import { CreateAvalTecnicoDto } from './dto/create-aval-tecnico.dto';
import { UpdateAvalTecnicoDto } from './dto/update-aval-tecnico.dto';

@Controller('aval-tecnicos')
export class AvalTecnicosController {
  constructor(private readonly avalTecnicosService: AvalTecnicosService) {}

  @Post()
  create(@Body() createAvalTecnicoDto: CreateAvalTecnicoDto) {
    return this.avalTecnicosService.create(createAvalTecnicoDto);
  }

  @Get()
  findAll() {
    return this.avalTecnicosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avalTecnicosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAvalTecnicoDto: UpdateAvalTecnicoDto) {
    return this.avalTecnicosService.update(+id, updateAvalTecnicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avalTecnicosService.remove(+id);
  }
}
