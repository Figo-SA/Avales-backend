import { ApiProperty } from '@nestjs/swagger';
import { Genero } from '@prisma/client';

class CategoriaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Juvenil' })
  nombre: string;
}

class DisciplinaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Fútbol' })
  nombre: string;
}

export class DeportistaResponseDto {
  @ApiProperty({ example: 1, description: 'ID del deportista' })
  id: number;

  @ApiProperty({
    example: 'Juan Carlos',
    description: 'Nombres del deportista',
  })
  nombres: string;

  @ApiProperty({
    example: 'Pérez González',
    description: 'Apellidos del deportista',
  })
  apellidos: string;

  @ApiProperty({ example: '1750123456', description: 'Cédula de identidad' })
  cedula: string;

  @ApiProperty({
    example: '2005-03-15T00:00:00.000Z',
    description: 'Fecha de nacimiento',
  })
  fechaNacimiento: Date;

  @ApiProperty({ example: true, description: 'Estado de afiliación' })
  afiliacion: boolean;

  @ApiProperty({
    enum: Genero,
    example: Genero.MASCULINO,
    description: 'Género del deportista',
  })
  genero: Genero;

  @ApiProperty({ type: CategoriaDto, description: 'Categoría del deportista' })
  categoria: CategoriaDto;

  @ApiProperty({ type: DisciplinaDto, description: 'Disciplina deportiva' })
  disciplina: DisciplinaDto;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Fecha de creación',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Fecha de actualización',
  })
  updatedAt: Date;
}
