import { PartialType } from '@nestjs/swagger';
import { AthleteBaseDto } from './athlete-base.dto';

/**
 * DTO para actualizar un atleta
 * Todos los campos son opcionales (hereda de PartialType)
 */
export class UpdateAthleteDto extends PartialType(AthleteBaseDto) {}
