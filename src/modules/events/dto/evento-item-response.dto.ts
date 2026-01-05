import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * DTO de respuesta para la actividad de un item
 */
export class EventoItemActividadDto {
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
 * DTO de respuesta para el item dentro de EventoItem
 */
export class EventoItemDetailDto {
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
    description: 'Número del item',
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
    type: EventoItemActividadDto,
  })
  actividad?: EventoItemActividadDto;
}

/**
 * DTO de respuesta para un item presupuestario asignado a un evento
 */
export class EventoItemResponseDto {
  @ApiProperty({
    description: 'ID del registro EventoItem',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Mes del presupuesto (1-12)',
    example: 3,
  })
  mes: number;

  @ApiProperty({
    description: 'Presupuesto asignado',
    example: '1500.00',
  })
  presupuesto: Decimal;

  @ApiProperty({
    description: 'Detalle del item presupuestario',
    type: EventoItemDetailDto,
  })
  item: EventoItemDetailDto;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2025-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
