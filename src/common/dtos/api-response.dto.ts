// src/common/dtos/api-response.dto.ts
import {
  ApiExtraModels,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

@ApiExtraModels()
export class GlobalMetaDto {
  @ApiProperty({ example: 'd1b9abf7-8a1f-4c2d-b2e6-8a9f0c1d6a3e' })
  requestId: string;

  @ApiProperty({ example: '2025-09-29T16:25:41Z' })
  timestamp: string;

  @ApiProperty({ example: 'v1' })
  apiVersion: string;

  @ApiProperty({ example: 42, description: 'Duración de la petición en ms' })
  durationMs: number;
}

@ApiExtraModels()
export class ApiResponseDto<T> {
  @ApiProperty({ example: 'success', enum: ['success', 'error'] })
  status: 'success' | 'error';

  @ApiProperty({ example: 'Operación completada correctamente' })
  message: string;

  @ApiPropertyOptional({ type: GlobalMetaDto })
  meta?: GlobalMetaDto;

  @ApiProperty({ description: 'Datos de la respuesta' })
  data: T;
}
