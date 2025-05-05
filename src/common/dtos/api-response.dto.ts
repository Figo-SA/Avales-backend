// src/common/dtos/api-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: 'success', enum: ['success', 'error'] })
  status: string;

  @ApiProperty({ example: 'Operación completada correctamente' })
  message: string;

  @ApiProperty({ description: 'Datos de la respuesta' })
  data: T;
}

// DTO para respuestas de error (opcional, para casos de error)
export class ErrorResponseDto {
  @ApiProperty({ example: 'error', enum: ['success', 'error'] })
  status: string;

  @ApiProperty({ example: 'Correo electrónico o cédula ya registrados' })
  message: string;

  @ApiProperty({ type: 'object', nullable: true, additionalProperties: true })
  data: null;
}
