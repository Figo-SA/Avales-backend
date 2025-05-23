import { Injectable } from '@nestjs/common';
import { CreateAvalTecnicoDto } from './dto/create-aval-tecnico.dto';
import { UpdateAvalTecnicoDto } from './dto/update-aval-tecnico.dto';

@Injectable()
export class AvalTecnicosService {
  create(createAvalTecnicoDto: CreateAvalTecnicoDto) {
    return 'This action adds a new avalTecnico';
  }

  findAll() {
    return `This action returns all avalTecnicos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} avalTecnico`;
  }

  update(id: number, updateAvalTecnicoDto: UpdateAvalTecnicoDto) {
    return `This action updates a #${id} avalTecnico`;
  }

  remove(id: number) {
    return `This action removes a #${id} avalTecnico`;
  }
}
