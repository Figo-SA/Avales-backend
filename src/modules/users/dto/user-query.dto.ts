import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

/**
 * DTO para query params de paginación y filtros de usuarios
 */
export class UserQueryDto {
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
    example: 10,
    minimum: 1,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Buscar por nombre, apellido, email o cédula',
    example: 'Juan',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  @IsOptional()
  query?: string;
}
