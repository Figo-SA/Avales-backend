import { IsOptional, IsEnum, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Estado } from '@prisma/client';
import { Type, Transform } from 'class-transformer';

export class EventFiltersDto {
  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filtrar eventos por estado',
    enum: Estado,
    example: Estado.DISPONIBLE,
  })
  @IsOptional()
  @IsEnum(Estado, {
    message:
      'El estado debe ser uno de: DISPONIBLE, SOLICITADO, RECHAZADO, ACEPTADO',
  })
  estado?: Estado;

  @ApiPropertyOptional({
    description: 'Buscar eventos por nombre, código, lugar, ciudad o provincia',
    example: 'Nacional',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar solo eventos que NO tienen ningún aval asociado',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  sinAval?: boolean;
}
