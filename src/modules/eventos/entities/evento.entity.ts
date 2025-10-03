import { ApiProperty } from '@nestjs/swagger';
import { Genero } from '@prisma/client';

export class Evento {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'EVT-2025-001' })
  codigo: string;

  @ApiProperty({ example: 'nacional' })
  tipoParticipacion: string;

  @ApiProperty({ example: 'campeonato' })
  tipoEvento: string;

  @ApiProperty({ example: 'Gran Premio Nacional' })
  nombre: string;

  @ApiProperty({ example: 'Estadio Nacional' })
  lugar: string;

  @ApiProperty({
    enum: ['MASCULINO', 'FEMENINO', 'MASCULINO_FEMENINO'],
    example: 'MASCULINO',
  })
  genero: Genero;

  @ApiProperty({ example: 1 })
  disciplinaId: number;

  @ApiProperty({ example: 1 })
  categoriaId: number;

  @ApiProperty({ example: 'Pichincha' })
  provincia: string;

  @ApiProperty({ example: 'Quito' })
  ciudad: string;

  @ApiProperty({ example: 'Ecuador' })
  pais: string;

  @ApiProperty({ example: 'nacional' })
  alcance: string;

  @ApiProperty({ example: new Date().toISOString() })
  fechaInicio: Date;

  @ApiProperty({ example: new Date().toISOString() })
  fechaFin: Date;

  @ApiProperty({ example: 0 })
  numEntrenadoresHombres: number;

  @ApiProperty({ example: 0 })
  numEntrenadoresMujeres: number;

  @ApiProperty({ example: 0 })
  numAtletasHombres: number;

  @ApiProperty({ example: 0 })
  numAtletasMujeres: number;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;

  @ApiProperty({ example: false })
  deleted: boolean;
}
