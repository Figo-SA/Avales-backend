import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsBoolean, IsInt, Min, IsEnum } from 'class-validator';
import { Genero } from '@prisma/client';

/**
 * DTO para query params de búsqueda y paginación de atletas
 */
export class AthleteQueryDto {
  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de resultados por página',
    example: 50,
    minimum: 1,
    default: 50,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 50;

  @ApiPropertyOptional({
    enum: Genero,
    description: 'Filtrar por género (MASCULINO/FEMENINO)',
  })
  @Transform(({ value }) => value?.toUpperCase())
  @IsEnum(Genero)
  @IsOptional()
  genero?: Genero;

  @ApiPropertyOptional({
    description: 'Buscar por nombres, apellidos o cédula',
    example: 'Juan',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  query?: string;

  @ApiPropertyOptional({
    description: 'Filtrar solo atletas afiliados',
    default: true,
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return true;
  })
  @IsBoolean()
  @IsOptional()
  soloAfiliados: boolean = true;
}
