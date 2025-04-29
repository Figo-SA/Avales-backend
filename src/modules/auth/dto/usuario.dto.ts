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

export class CreateUsuarioDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 32)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  apellido: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/) // Solo 10 números
  cedula: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoria_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  disciplina_id: number;
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
