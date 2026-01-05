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
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { trimAndLowercase, trimString } from 'src/common/herlpers/transformers';
import { TipoRol } from '@prisma/client';

/**
 * DTO base con campos compartidos entre Create y Update
 * Los nombres de campos coinciden con el schema de Prisma
 */
export class UserBaseDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
    maxLength: 150,
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
    description: 'Cédula de identidad (10 dígitos). Debe ser única en el sistema.',
    minLength: 10,
    maxLength: 10,
  })
  @IsString()
  @Transform(({ value }) => trimString(value))
  @Length(10, 10, { message: 'La cédula debe tener exactamente 10 dígitos' })
  cedula: string;

  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Email del usuario. Debe ser único en el sistema.',
    format: 'email',
    maxLength: 150,
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @Transform(({ value }) => trimAndLowercase(value))
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la categoría del usuario',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoriaId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la disciplina del usuario',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  disciplinaId?: number;

  @ApiPropertyOptional({
    example: [TipoRol.ADMIN, TipoRol.SECRETARIA],
    description: 'Array de roles a asignar',
    isArray: true,
    enum: TipoRol,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TipoRol, { each: true })
  roles?: TipoRol[];
}
