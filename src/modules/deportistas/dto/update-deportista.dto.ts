import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { DeportistaEditableDto } from './deportista-editable.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateDeportistaDto extends PartialType(DeportistaEditableDto) {
  @ApiPropertyOptional({
    description: 'Afiliación activa del deportista',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  afiliacion?: boolean;
}
