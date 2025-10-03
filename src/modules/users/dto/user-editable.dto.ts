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

export class UserEditableDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @ApiPropertyOptional({ example: 'Pérez' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @MaxLength(150)
  apellido?: string;

  @ApiProperty({ example: '1234567890', description: '10 dígitos' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(10, 10, { message: 'La cédula debe tener exactamente 10 dígitos' })
  cedula: string;

  @ApiProperty({ example: 'nuevo@ejemplo.com' })
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Por defecto 1 si no se envía',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoriaId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Por defecto 1 si no se envía',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  disciplinaId?: number;

  @ApiPropertyOptional({ example: [3, 7], description: 'IDs de roles' })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  rolIds?: number[];
}
