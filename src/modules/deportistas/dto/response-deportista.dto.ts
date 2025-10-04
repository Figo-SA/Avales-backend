import { ApiProperty } from '@nestjs/swagger';

export class ResponseDeportistaDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'María Fernanda' })
  nombres: string;

  @ApiProperty({ example: 'Pérez Gómez' })
  apellidos: string;

  @ApiProperty({ example: '1104680135' })
  cedula: string;

  @ApiProperty({ example: '2000-01-01' })
  fechaNacimiento: string;

  @ApiProperty({ example: 'FEMENINO' })
  genero: string;

  @ApiProperty({ example: 1 })
  categoriaId: number;

  @ApiProperty({ example: 1 })
  disciplinaId: number;

  @ApiProperty({ example: true })
  afiliacion: boolean;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-10-04T12:00:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Última fecha de actualización',
    example: '2025-10-04T12:00:00.000Z',
  })
  updatedAt: string;
}
