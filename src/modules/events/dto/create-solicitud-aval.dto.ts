import { ApiProperty } from '@nestjs/swagger';
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
import { Type } from 'class-transformer';

// DTO para objetivos
export class ObjetivoDto {
  @ApiProperty({ example: 1, description: 'Orden del objetivo' })
  @IsInt()
  @Min(1)
  orden: number;

  @ApiProperty({
    example: 'Obtener experiencia internacional',
    description: 'Descripción del objetivo',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}

// DTO para criterios de selección
export class CriterioDto {
  @ApiProperty({ example: 1, description: 'Orden del criterio' })
  @IsInt()
  @Min(1)
  orden: number;

  @ApiProperty({
    example: 'Rendimiento en competencias nacionales',
    description: 'Descripción del criterio',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}

// DTO para rubros presupuestarios
export class RubroPresupuestarioDto {
  @ApiProperty({ example: 1, description: 'ID del rubro' })
  @IsInt()
  rubroId: number;

  @ApiProperty({ example: '5', description: 'Cantidad de días' })
  @IsString()
  @IsNotEmpty()
  cantidadDias: string;

  @ApiProperty({
    example: 50.0,
    description: 'Valor unitario',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  valorUnitario?: number;
}

// DTO para deportistas
export class DeportistaAvalDto {
  @ApiProperty({ example: 1, description: 'ID del deportista' })
  @IsInt()
  deportistaId: number;

  @ApiProperty({
    example: 'ATLETA',
    description: 'Rol del deportista (ATLETA, DELEGADO, etc.)',
  })
  @IsString()
  @IsNotEmpty()
  rol: string;
}

// DTO para entrenadores
export class EntrenadorDto {
  @ApiProperty({ example: 1, description: 'ID del usuario entrenador' })
  @IsInt()
  entrenadorId: number;

  @ApiProperty({
    example: 'ENTRENADOR PRINCIPAL',
    description: 'Rol del entrenador',
  })
  @IsString()
  @IsNotEmpty()
  rol: string;

  @ApiProperty({ example: true, description: 'Es el entrenador principal' })
  @IsOptional()
  esPrincipal?: boolean;
}

// DTO principal para crear solicitud de aval
export class CreateSolicitudAvalDto {
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
  transporteSalida: string;

  @ApiProperty({
    example: 'Bus interprovincial',
    description: 'Tipo de transporte de retorno',
  })
  @IsString()
  @IsNotEmpty()
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
    type: [EntrenadorDto],
    description: 'Entrenadores participantes',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntrenadorDto)
  entrenadores: EntrenadorDto[];

  @ApiProperty({
    example: 'Ninguna',
    description: 'Observaciones adicionales',
    required: false,
  })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
