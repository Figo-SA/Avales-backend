import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';
import { Genero } from '@prisma/client';

export class CreateDeportistaDto {
  @ApiProperty({
    description: 'Nombres del deportista',
    example: 'Juan Carlos',
  })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({
    description: 'Apellidos del deportista',
    example: 'Pérez González',
  })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiProperty({
    description: 'Cédula de identidad del deportista',
    example: '1750123456',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  cedula: string;

  @ApiProperty({
    description: 'Fecha de nacimiento (ISO 8601)',
    example: '2005-03-15T00:00:00.000Z',
  })
  @IsDateString()
  fechaNacimiento: string;

  @ApiProperty({
    enum: Genero,
    description: 'Género del deportista',
    example: Genero.MASCULINO,
  })
  @IsEnum(Genero)
  genero: Genero;

  @ApiProperty({
    description: 'ID de la categoría del deportista',
    example: 3,
  })
  @IsInt()
  categoriaId: number;

  @ApiProperty({
    description: 'ID de la disciplina del deportista',
    example: 2,
  })
  @IsInt()
  disciplinaId: number;
}
