import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Genero } from '@prisma/client';

/* ----------  sub-DTOs  ---------- */

export class ObjetivoDto {
  @IsString()
  @MaxLength(600)
  descripcion: string;
}

export class CriterioDto {
  @IsString()
  @MaxLength(600)
  descripcion: string;
}

export class RequerimientoDto {
  @IsString() rubro: string; // Transporte, Alimentación, …
  @IsString() @MaxLength(600) descripcion: string;
}

export class DelegacionDto {
  @IsInt() @Min(0) dirigentes: number;
  @IsInt() @Min(0) tecnicos: number;
  @IsInt() @Min(0) jueces: number;
  @IsInt() @Min(0) atleDam: number; // atletas damas
  @IsInt() @Min(0) atleVar: number; // atletas varones
  @IsInt() @Min(0) medico: number;
  @IsInt() @Min(0) psicologo: number;
  @IsInt() @Min(0) otros: number;
}

/* ----------  DTO base  ---------- */

export class BaseAvalTecnicoDto {
  /* === Datos informativos (muchos de estos terminarán en ColeccionAval) === */
  @IsInt() disciplinaId: number;
  @IsInt() categoriaId: number;
  @IsEnum(Genero) genero: Genero;

  @IsString() @MaxLength(255) evento: string;
  @IsString() @MaxLength(255) lugar: string;

  @IsDateString() fechaInicio: string; // 2024-07-18
  @IsDateString() fechaFin: string; // 2024-07-21

  @IsArray() @IsInt({ each: true }) entrenadoresIds: number[]; // usuarios

  /* === Delegación === */
  @ValidateNested()
  @Type(() => DelegacionDto)
  delegacion: DelegacionDto;

  /* === Objetivos, criterios y requerimientos === */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ObjetivoDto)
  objetivos: ObjetivoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CriterioDto)
  criterios: CriterioDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequerimientoDto)
  requerimientos: RequerimientoDto[];

  /* === Horarios y transporte === */
  @IsDateString() fechaSalida: string;
  @IsString() horaSalida: string; // “06:00”
  @IsString() transporteSalida: string;

  @IsDateString() fechaRetorno: string;
  @IsString() horaRetorno: string;
  @IsString() transporteRetorno: string;

  /* === Información general del documento === */
  @IsString() @MaxLength(600) descripcion: string;

  @IsOptional()
  @IsString()
  @MaxLength(355)
  archivo?: string; // path o url al PDF firmado

  @IsOptional()
  @IsString()
  @MaxLength(600)
  observaciones?: string;
}
