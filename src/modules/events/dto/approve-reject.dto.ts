import { IsInt, IsOptional, IsString } from 'class-validator';

export class ApproveRejectDto {
  @IsInt()
  usuarioId: number;

  @IsOptional()
  @IsString()
  motivo?: string;
}
