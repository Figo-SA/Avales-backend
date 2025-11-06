import { ApiProperty } from '@nestjs/swagger';
import { Genero } from '@prisma/client';

export class EventResponseDto {
  @ApiProperty({
    description: 'ID único del evento',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Código único del evento',
    example: 'EVT-2025-001',
  })
  codigo: string;

  @ApiProperty({
    description: 'Tipo de participación del evento',
    example: 'Internacional',
  })
  tipoParticipacion: string;

  @ApiProperty({
    description: 'Tipo de evento',
    example: 'Campeonato',
  })
  tipoEvento: string;

  @ApiProperty({
    description: 'Nombre del evento',
    example: 'Campeonato Nacional de Atletismo 2025',
  })
  nombre: string;

  @ApiProperty({
    description: 'Lugar donde se realizará el evento',
    example: 'Estadio Olímpico Atahualpa',
  })
  lugar: string;

  @ApiProperty({
    description: 'Género del evento',
    enum: Genero,
    example: Genero.MASCULINO_FEMENINO,
  })
  genero: Genero;

  @ApiProperty({
    description: 'ID de la disciplina',
    example: 1,
  })
  disciplinaId: number;

  @ApiProperty({
    description: 'ID de la categoría',
    example: 1,
  })
  categoriaId: number;

  @ApiProperty({
    description: 'Provincia donde se realiza el evento',
    example: 'Pichincha',
  })
  provincia: string;

  @ApiProperty({
    description: 'Ciudad donde se realiza el evento',
    example: 'Quito',
  })
  ciudad: string;

  @ApiProperty({
    description: 'País donde se realiza el evento',
    example: 'Ecuador',
  })
  pais: string;

  @ApiProperty({
    description: 'Alcance del evento',
    example: 'Nacional',
  })
  alcance: string;

  @ApiProperty({
    description: 'Fecha de inicio del evento',
    example: '2025-12-01T08:00:00.000Z',
  })
  fechaInicio: Date;

  @ApiProperty({
    description: 'Fecha de fin del evento',
    example: '2025-12-05T18:00:00.000Z',
  })
  fechaFin: Date;

  @ApiProperty({
    description: 'Número de entrenadores hombres',
    example: 5,
  })
  numEntrenadoresHombres: number;

  @ApiProperty({
    description: 'Número de entrenadoras mujeres',
    example: 3,
  })
  numEntrenadoresMujeres: number;

  @ApiProperty({
    description: 'Número de atletas hombres',
    example: 20,
  })
  numAtletasHombres: number;

  @ApiProperty({
    description: 'Número de atletas mujeres',
    example: 15,
  })
  numAtletasMujeres: number;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2025-01-20T14:45:00.000Z',
  })
  updatedAt: Date;
}
