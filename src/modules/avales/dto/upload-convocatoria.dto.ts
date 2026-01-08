import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadConvocatoriaDto {
  @ApiProperty({
    description: 'ID del evento para el cual se sube la convocatoria',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  eventoId: number;
}
