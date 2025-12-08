import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateDeportistaDto } from './create-deportista.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateDeportistaDto extends PartialType(CreateDeportistaDto) {
  @ApiPropertyOptional({ description: 'Estado de afiliación', example: true })
  @IsOptional()
  @IsBoolean()
  afiliacion?: boolean;
}
