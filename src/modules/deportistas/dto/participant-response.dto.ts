import { ApiProperty } from '@nestjs/swagger';

export class ParticipantResponseDto {
  @ApiProperty({ example: '1' })
  id: string | number;

  @ApiProperty({ example: 'Juan Carlos' })
  nombres: string;

  @ApiProperty({ example: 'Pérez González' })
  apellidos: string;

  @ApiProperty({ example: '1750123456' })
  cedula: string;

  @ApiProperty({ example: 'masculino' })
  sexo: string;

  @ApiProperty({ example: '2005-03-15T00:00:00.000Z', required: false })
  fechaNacimiento?: string;

  @ApiProperty({ example: 'Club Central', required: false })
  club?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  createdAt?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', required: false })
  updatedAt?: string;
}
