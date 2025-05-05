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
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class BaseUsuarioDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario (opcional)',
    example: 'nuevo@ejemplo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

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
  apellido?: string;

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
