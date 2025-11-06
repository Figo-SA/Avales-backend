// problem-details.dto.ts — usa ejemplos neutros o quítalos del todo
import { ApiProperty } from '@nestjs/swagger';

export class ProblemDetailsDto {
  @ApiProperty({ example: 'https://api.tu-dominio.com/errors/{slug}' })
  type: string;

  @ApiProperty({ example: 'Error title' })
  title: string;

  @ApiProperty({ example: 400 })
  status: number;

  @ApiProperty({ example: 'Descripción breve del problema' })
  detail: string;

  @ApiProperty({ example: '/api/v1/recurso' })
  instance: string;

  @ApiProperty({ example: '9c0e-...-3800' })
  requestId: string;

  @ApiProperty({ example: '1.0' })
  apiVersion: string;

  @ApiProperty({ example: 123, required: false, description: 'Duración en ms' })
  durationMs?: number;

  @ApiProperty({
    required: false,
    description: 'Información adicional sobre el error',
    example: { field: 'email', errorCode: 'DUPLICATE_EMAIL' },
  })
  extensions?: Record<string, any>;
}
