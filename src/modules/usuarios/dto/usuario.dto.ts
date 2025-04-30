// src/usuario/dto/create-usuario.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsInt,
  Min,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario (opcional)',
    example: 'nuevo@ejemplo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (6-32 caracteres)',
    example: 'password123',
  })
  @IsString()
  @Length(6, 32)
  password: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario (opcional)',
    example: 'Pérez',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  apellido: string;

  @ApiProperty({
    description: 'Cédula del usuario (10 dígitos)',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, {
    message: 'La cédula debe tener exactamente 10 dígitos',
  })
  cedula: string;

  @ApiProperty({
    description: 'ID de la categoría del usuario (por defecto: 1)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoria_id: number;

  @ApiProperty({
    description: 'ID de la disciplina del usuario (por defecto: 1)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  disciplina_id: number;

  @ApiProperty({
    description: 'ID del rol del usuario',
    example: 3,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rol_id: number;
}

export class UpdateUsuarioDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(6, 32)
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  apellido?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{10}$/, { message: 'La cédula debe tener 10 dígitos numéricos' })
  cedula?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoria_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  disciplina_id: number;
}
