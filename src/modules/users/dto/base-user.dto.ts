import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
  MaxLength,
  Matches,
  isBoolean,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BaseUserDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario (opcional)',
    example: 'nuevo@ejemplo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario (opcional)',
    example: 'Pérez',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  apellido?: string;

  @ApiProperty({
    description: 'Cédula del usuario (10 dígitos)',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
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
  categoria_id?: number;

  @ApiProperty({
    description: 'ID de la disciplina del usuario (por defecto: 1)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  disciplina_id?: number;
}
