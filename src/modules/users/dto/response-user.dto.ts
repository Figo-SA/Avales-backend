// dto/response-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { TipoRol } from '@prisma/client';

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
    description: 'Categoría del usuario',
    example: {
      id: 1,
      nombre: 'Atleta',
    },
  })
  categoria: {
    id: number;
    nombre: string;
  };

  @ApiProperty({
    description: 'Disciplina del usuario',
    example: {
      id: 1,
      nombre: 'Fútbol',
    },
  })
  disciplina: {
    id: number;
    nombre: string;
  };

  @ApiProperty({
    description: 'Lista de roles asignados al usuario',
    example: [TipoRol.ADMIN, TipoRol.SECRETARIA],
    enum: TipoRol,
    isArray: true,
  })
  roles: TipoRol[];

  @ApiProperty({
    description: 'Token de Expo para push notifications',
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
    required: false,
  })
  pushToken?: string;

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
