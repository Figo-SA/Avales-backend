import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsEnum,
  IsBoolean,
  IsOptional,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';
import { Genero } from '@prisma/client';

/**
 * Helper para limpiar strings (trim)
 */
const trimString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

/**
 * DTO base con campos compartidos entre Create y Update
 * Los nombres coinciden con el schema de Prisma
 */
export class AthleteBaseDto {
  @ApiProperty({
    description: 'Nombres del atleta',
    example: 'Juan Carlos',
    minLength: 1,
    maxLength: 150,
  })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  nombres: string;

  @ApiProperty({
    description: 'Apellidos del atleta',
    example: 'Pérez González',
    minLength: 1,
    maxLength: 150,
  })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  apellidos: string;

  @ApiProperty({
    description: 'Cédula de identidad del atleta (debe ser única)',
    example: '1750123456',
    maxLength: 50,
  })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  cedula: string;

  @ApiProperty({
    description: 'Fecha de nacimiento en formato ISO 8601',
    example: '2005-03-15',
  })
  @IsDateString()
  fechaNacimiento: string;

  @ApiProperty({
    enum: Genero,
    description: 'Género del atleta',
    example: Genero.MASCULINO,
  })
  @IsEnum(Genero)
  genero: Genero;

  @ApiProperty({
    description: 'ID de la categoría del atleta',
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoriaId: number;

  @ApiProperty({
    description: 'ID de la disciplina del atleta',
    example: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  disciplinaId: number;

  @ApiProperty({
    description: 'Estado de afiliación (true si está afiliado)',
    example: true,
  })
  @IsBoolean()
  afiliacion: boolean;

  @ApiPropertyOptional({
    description: 'Fecha de inicio de la afiliación en formato ISO 8601',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  afiliacionInicio?: string;
}
