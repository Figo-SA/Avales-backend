import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsDateString,
  IsInt,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// DTO para objetivos
export class ObjetivoDto {
  @ApiProperty({ example: 1, description: 'Orden del objetivo' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  orden: number;

  @ApiProperty({
    example: 'Obtener experiencia internacional',
    description: 'Descripción del objetivo',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  descripcion: string;
}

// DTO para criterios de selección
export class CriterioDto {
  @ApiProperty({ example: 1, description: 'Orden del criterio' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  orden: number;

  @ApiProperty({
    example: 'Rendimiento en competencias nacionales',
    description: 'Descripción del criterio',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  descripcion: string;
}

// DTO para rubros presupuestarios
export class RubroPresupuestarioDto {
  @ApiProperty({ example: 1, description: 'ID del rubro' })
  @IsInt()
  @Type(() => Number)
  rubroId: number;

  @ApiProperty({ example: '5', description: 'Cantidad de días' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  cantidadDias: string;

  @ApiPropertyOptional({
    example: 50.0,
    description: 'Valor unitario',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  valorUnitario?: number;
}

// DTO para deportistas
export class DeportistaAvalDto {
  @ApiProperty({ example: 1, description: 'ID del deportista' })
  @IsInt()
  @Type(() => Number)
  deportistaId: number;

  @ApiProperty({
    example: 'ATLETA',
    description: 'Rol del deportista (ATLETA, DELEGADO, etc.)',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  rol: string;
}

// DTO para entrenadores
export class EntrenadorAvalDto {
  @ApiProperty({ example: 1, description: 'ID del usuario entrenador' })
  @IsInt()
  @Type(() => Number)
  entrenadorId: number;

  @ApiProperty({
    example: 'ENTRENADOR PRINCIPAL',
    description: 'Rol del entrenador',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  rol: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Es el entrenador principal',
  })
  @IsOptional()
  esPrincipal?: boolean;
}

// DTO base para crear aval (solicitud)
export class AvalBaseDto {
  @ApiProperty({ example: 1, description: 'ID del evento' })
  @IsInt()
  @Type(() => Number)
  eventoId: number;

  @ApiProperty({
    example: '2025-06-01T06:00:00Z',
    description: 'Fecha y hora de salida',
  })
  @IsDateString()
  fechaHoraSalida: string;

  @ApiProperty({
    example: '2025-06-05T20:00:00Z',
    description: 'Fecha y hora de retorno',
  })
  @IsDateString()
  fechaHoraRetorno: string;

  @ApiProperty({
    example: 'Bus interprovincial',
    description: 'Tipo de transporte de salida',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  transporteSalida: string;

  @ApiProperty({
    example: 'Bus interprovincial',
    description: 'Tipo de transporte de retorno',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  transporteRetorno: string;

  @ApiProperty({
    type: [ObjetivoDto],
    description: 'Objetivos de participación',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ObjetivoDto)
  objetivos: ObjetivoDto[];

  @ApiProperty({
    type: [CriterioDto],
    description: 'Criterios de selección',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriterioDto)
  criterios: CriterioDto[];

  @ApiProperty({
    type: [RubroPresupuestarioDto],
    description: 'Rubros presupuestarios',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RubroPresupuestarioDto)
  rubros: RubroPresupuestarioDto[];

  @ApiProperty({
    type: [DeportistaAvalDto],
    description: 'Deportistas participantes',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeportistaAvalDto)
  deportistas: DeportistaAvalDto[];

  @ApiProperty({
    type: [EntrenadorAvalDto],
    description: 'Entrenadores participantes',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntrenadorAvalDto)
  entrenadores: EntrenadorAvalDto[];

  @ApiPropertyOptional({
    example: 'Ninguna',
    description: 'Observaciones adicionales',
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  observaciones?: string;
}
