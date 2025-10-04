import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Genero } from '@prisma/client';

export class DeportistaEditableDto {
  @ApiProperty({
    description: 'Nombres del deportista',
    example: 'María Fernanda',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombres: string;

  @ApiProperty({
    description: 'Apellidos del deportista',
    example: 'Pérez Gómez',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  apellidos: string;

  @ApiProperty({
    description: 'Cédula del deportista (10 dígitos numéricos)',
    example: '1104680135',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, {
    message: 'La cédula debe tener exactamente 10 dígitos numéricos',
  })
  cedula: string;

  @ApiProperty({
    description: 'Fecha de nacimiento (formato ISO 8601)',
    example: '2000-01-01',
  })
  @IsDateString({}, { message: 'Debe ser una fecha válida (ISO 8601)' })
  fechaNacimiento: string;

  @ApiProperty({
    description: 'Género del deportista',
    enum: Genero,
    example: 'FEMENINO',
  })
  @IsEnum(Genero, { message: 'Debe ser uno de: MASCULINO, FEMENINO, OTRO' })
  genero: Genero;

  @ApiProperty({
    description: 'ID de la categoría',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoriaId: number;

  @ApiProperty({
    description: 'ID de la disciplina',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  disciplinaId: number;

  @ApiProperty({
    description: 'Afiliación activa del deportista',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  afiliacion?: boolean;
}
