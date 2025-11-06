// dto/user-editable.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  IsInt,
  Min,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { trimAndLowercase, trimString } from 'src/common/herlpers/transformers';

export class UserEditableDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
    maxLength: 150,
    required: true,
  })
  @IsString()
  @Transform(({ value }) => trimString(value))
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiPropertyOptional({
    example: 'Pérez',
    description: 'Apellido del usuario',
    maxLength: 150,
  })
  @IsString()
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @MaxLength(150)
  apellido?: string;

  @ApiProperty({
    example: '1234567890',
    description:
      'Cédula de identidad (10 dígitos). Debe ser única en el sistema.',
    minLength: 10,
    maxLength: 10,
    required: true,
  })
  @IsString()
  @Transform(({ value }) => trimString(value))
  @Length(10, 10, { message: 'La cédula debe tener exactamente 10 dígitos' })
  cedula: string;

  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description:
      'Email del usuario. Debe ser único en el sistema y válido según RFC 5322.',
    format: 'email',
    maxLength: 150,
    required: true,
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @Transform(({ value }) => trimAndLowercase(value))
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional({
    example: 1,
    description:
      'ID de la categoría del usuario. Por defecto 1 si no se envía. Debe existir en la tabla de categorías.',
    minimum: 1,
    type: 'integer',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoriaId?: number;

  @ApiPropertyOptional({
    example: 1,
    description:
      'ID de la disciplina del usuario. Por defecto 1 si no se envía. Debe existir en la tabla de disciplinas.',
    minimum: 1,
    type: 'integer',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  disciplinaId?: number;

  @ApiPropertyOptional({
    example: [3, 7],
    description:
      'Array de IDs de roles a asignar. Cada rol debe existir en la tabla de roles.',
    type: [Number],
    isArray: true,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  rolIds?: number[];
}
