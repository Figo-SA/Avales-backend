import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';
import { Genero } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({
    description: 'Código único del evento',
    example: 'EVT-2025-001',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  codigo: string;

  @ApiProperty({
    description: 'Tipo de participación del evento',
    example: 'Internacional',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tipoParticipacion: string;

  @ApiProperty({
    description: 'Tipo de evento',
    example: 'Campeonato',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tipoEvento: string;

  @ApiProperty({
    description: 'Nombre del evento',
    example: 'Campeonato Nacional de Atletismo 2025',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    description: 'Lugar donde se realizará el evento',
    example: 'Estadio Olímpico Atahualpa',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lugar: string;

  @ApiProperty({
    description: 'Género del evento',
    enum: Genero,
    example: Genero.MASCULINO_FEMENINO,
  })
  @IsEnum(Genero)
  @IsNotEmpty()
  genero: Genero;

  @ApiProperty({
    description: 'ID de la disciplina',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  disciplinaId: number;

  @ApiProperty({
    description: 'ID de la categoría',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoriaId: number;

  @ApiProperty({
    description: 'Provincia donde se realiza el evento',
    example: 'Pichincha',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  provincia: string;

  @ApiProperty({
    description: 'Ciudad donde se realiza el evento',
    example: 'Quito',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  ciudad: string;

  @ApiProperty({
    description: 'País donde se realiza el evento',
    example: 'Ecuador',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  pais: string;

  @ApiProperty({
    description: 'Alcance del evento',
    example: 'Nacional',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  alcance: string;

  @ApiProperty({
    description: 'Fecha de inicio del evento',
    example: '2025-12-01T08:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @ApiProperty({
    description: 'Fecha de fin del evento',
    example: '2025-12-05T18:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;

  @ApiProperty({
    description: 'Número de entrenadores hombres',
    example: 5,
    minimum: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  numEntrenadoresHombres: number;

  @ApiProperty({
    description: 'Número de entrenadoras mujeres',
    example: 3,
    minimum: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  numEntrenadoresMujeres: number;

  @ApiProperty({
    description: 'Número de atletas hombres',
    example: 20,
    minimum: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  numAtletasHombres: number;

  @ApiProperty({
    description: 'Número de atletas mujeres',
    example: 15,
    minimum: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  numAtletasMujeres: number;
}
