import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsEnum, IsString } from 'class-validator';
import { Estado, EtapaFlujo } from '@prisma/client';

export class AvalQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Número de página',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 50,
    description: 'Cantidad de registros por página',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @ApiPropertyOptional({
    enum: Estado,
    description: 'Filtrar por estado del aval',
    example: 'SOLICITADO',
  })
  @IsOptional()
  @IsEnum(Estado)
  estado?: Estado;

  @ApiPropertyOptional({
    enum: EtapaFlujo,
    description: 'Filtrar por etapa del flujo de aprobación',
    example: 'REVISION_DTM',
  })
  @IsOptional()
  @IsEnum(EtapaFlujo)
  etapa?: EtapaFlujo;

  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar por ID del evento',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  eventoId?: number;

  @ApiPropertyOptional({
    example: 'campeonato',
    description: 'Búsqueda por nombre o código del evento',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;
}
