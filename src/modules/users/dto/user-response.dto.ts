import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoRol, Genero } from '@prisma/client';

/**
 * DTO para categoría embebida en respuesta
 */
class CategoriaDto {
  @ApiProperty({ example: 1, description: 'ID de la categoría' })
  id: number;

  @ApiProperty({ example: 'Atleta', description: 'Nombre de la categoría' })
  nombre: string;
}

/**
 * DTO para disciplina embebida en respuesta
 */
class DisciplinaDto {
  @ApiProperty({ example: 1, description: 'ID de la disciplina' })
  id: number;

  @ApiProperty({ example: 'Fútbol', description: 'Nombre de la disciplina' })
  nombre: string;
}

/**
 * DTO de respuesta para usuario
 * Los campos están en español para coincidir con la BD y el frontend
 */
export class UserResponseDto {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: 101,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  nombre: string;

  @ApiPropertyOptional({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  apellido?: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Cédula de identidad del usuario',
    example: '1234567890',
  })
  cedula: string;

  @ApiProperty({
    description: 'Categoría del usuario',
    type: CategoriaDto,
  })
  categoria: CategoriaDto;

  @ApiProperty({
    description: 'Disciplina del usuario',
    type: DisciplinaDto,
  })
  disciplina: DisciplinaDto;

  @ApiPropertyOptional({
    description: 'Género del usuario',
    enum: Genero,
    example: 'MASCULINO',
  })
  genero?: Genero;

  @ApiProperty({
    description: 'Lista de roles asignados al usuario',
    example: [TipoRol.ADMIN, TipoRol.SECRETARIA],
    enum: TipoRol,
    isArray: true,
  })
  roles: TipoRol[];

  @ApiPropertyOptional({
    description: 'Token de Expo para push notifications',
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
  })
  pushToken?: string;

  @ApiPropertyOptional({
    description: 'Fecha de creación del usuario',
    example: '2025-09-25T14:48:00.000Z',
  })
  createdAt?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de última actualización',
    example: '2025-10-01T10:15:30.000Z',
  })
  updatedAt?: Date;
}
