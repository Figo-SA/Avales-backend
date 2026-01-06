import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO de respuesta para la actividad asociada a un item
 */
export class ItemActividadResponseDto {
  @ApiProperty({
    description: 'ID de la actividad',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre de la actividad',
    example: 'Capacitación y Competencias',
  })
  nombre: string;

  @ApiProperty({
    description: 'Número de la actividad',
    example: 53,
  })
  numero: number;
}

/**
 * DTO de respuesta para un item presupuestario
 */
export class ItemResponseDto {
  @ApiProperty({
    description: 'ID del item',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del item',
    example: 'Pasajes aéreos nacionales',
  })
  nombre: string;

  @ApiProperty({
    description: 'Número del item dentro de la actividad',
    example: 1,
  })
  numero: number;

  @ApiProperty({
    description: 'Descripción del item',
    example: 'Pasajes aéreos para competencias nacionales',
  })
  descripcion: string;

  @ApiPropertyOptional({
    description: 'Actividad a la que pertenece el item',
    type: ItemActividadResponseDto,
  })
  actividad?: ItemActividadResponseDto;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: string;
}