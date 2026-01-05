import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Genero } from '@prisma/client';

/**
 * DTO para categoría embebida en respuesta
 */
class CategoriaDto {
  @ApiProperty({ example: 1, description: 'ID de la categoría' })
  id: number;

  @ApiProperty({ example: 'Juvenil', description: 'Nombre de la categoría' })
  nombre: string;
}

/**
 * DTO para disciplina embebida en respuesta
 */
class DisciplinaDto {
  @ApiProperty({ example: 1, description: 'ID de la disciplina' })
  id: number;

  @ApiProperty({ example: 'Natación', description: 'Nombre de la disciplina' })
  nombre: string;
}

/**
 * DTO de respuesta para atleta
 * Los campos están en español para coincidir con la BD y el frontend
 */
export class AthleteResponseDto {
  @ApiProperty({ example: 1, description: 'ID único del atleta' })
  id: number;

  @ApiProperty({ example: 'Juan Carlos', description: 'Nombres del atleta' })
  nombres: string;

  @ApiProperty({ example: 'Pérez González', description: 'Apellidos del atleta' })
  apellidos: string;

  @ApiProperty({ example: '1750123456', description: 'Cédula de identidad' })
  cedula: string;

  @ApiProperty({
    example: '2005-03-15T00:00:00.000Z',
    description: 'Fecha de nacimiento',
  })
  fechaNacimiento: string;

  @ApiProperty({
    enum: Genero,
    example: 'MASCULINO',
    description: 'Género del atleta',
  })
  genero: string;

  @ApiProperty({ example: true, description: 'Estado de afiliación' })
  afiliacion: boolean;

  @ApiPropertyOptional({ type: CategoriaDto, description: 'Categoría del atleta' })
  categoria?: CategoriaDto;

  @ApiPropertyOptional({ type: DisciplinaDto, description: 'Disciplina deportiva' })
  disciplina?: DisciplinaDto;

  @ApiPropertyOptional({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Fecha de inicio de afiliación',
  })
  afiliacionInicio?: string;

  @ApiPropertyOptional({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Fecha de fin de afiliación',
  })
  afiliacionFin?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Fecha de creación del registro',
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Fecha de última actualización',
  })
  updatedAt: string;
}
