// dto/response-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
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

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
    required: false,
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
    description: 'ID de la categoría del usuario',
    example: 1,
    required: false,
  })
  categoriaId?: number;

  @ApiProperty({
    description: 'ID de la disciplina del usuario',
    example: 5,
    required: false,
  })
  disciplinaId?: number;

  @ApiProperty({
    description: 'Lista de IDs de roles asignados al usuario',
    example: [1, 2, 3],
    type: [Number],
  })
  rolIds: number[];

  @ApiProperty({
    description: 'Fecha de creación del usuario en el sistema',
    example: '2025-09-25T14:48:00.000Z',
    required: false,
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario en el sistema',
    example: '2025-10-01T10:15:30.000Z',
    required: false,
  })
  updatedAt?: Date;
}
