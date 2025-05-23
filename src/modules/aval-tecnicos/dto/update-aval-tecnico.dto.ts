import { PartialType } from '@nestjs/swagger';
import { CreateAvalTecnicoDto } from './create-aval-tecnico.dto';

export class UpdateAvalTecnicoDto extends PartialType(CreateAvalTecnicoDto) {}
