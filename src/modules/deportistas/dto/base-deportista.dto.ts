import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BaseDeportistaDto {
  @ApiProperty({
    description: 'Nombres del deportista',
    example: 'María Fernanda',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombres: string;

  @ApiProperty({
    description: 'Apellidos del deportista',
    example: 'Pérez Gómez',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  apellidos: string;

  @ApiProperty({
    description: 'Cédula del deportista (única, 10 dígitos)',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, {
    message: 'La cédula debe tener exactamente 10 dígitos',
  })
  cedula: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del deportista (ISO 8601)',
    example: '2000-01-01',
  })
  @Type(() => Date)
  @IsDate()
  fecha_nacimiento: Date;

  @ApiProperty({
    description: 'Género del deportista',
    example: 'Femenino',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  genero: string;

  @ApiProperty({
    description: 'ID de la categoría',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoria_id: number;

  @ApiProperty({
    description: 'ID de la disciplina',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  disciplina_id: number;

  @ApiProperty({
    description: 'Afiliación activa del deportista',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  afiliacion?: boolean;
}
