import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ApproveRejectAvalDto {
  @ApiProperty({
    example: 1,
    description: 'ID del usuario que aprueba o rechaza',
  })
  @IsInt()
  @Type(() => Number)
  usuarioId: number;

  @ApiPropertyOptional({
    example: 'No cumple con los requisitos mínimos',
    description: 'Motivo del rechazo (requerido al rechazar)',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  motivo?: string;
}
