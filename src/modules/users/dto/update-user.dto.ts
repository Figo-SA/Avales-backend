import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, IsArray, IsEnum } from 'class-validator';
import { TipoRol } from '@prisma/client';
import { UserBaseDto } from './user-base.dto';

/**
 * DTO para actualizar un usuario
 * Usa PartialType para hacer todos los campos opcionales
 */
export class UpdateUserDto extends PartialType(UserBaseDto) {
  @ApiPropertyOptional({
    example: 'newpass123',
    description: 'Nueva contraseña (opcional)',
    minLength: 6,
    maxLength: 32,
  })
  @IsOptional()
  @IsString()
  @Length(6, 32)
  password?: string;

  @ApiPropertyOptional({
    example: [TipoRol.ADMIN, TipoRol.SECRETARIA],
    description: 'Nuevos roles a asignar (reemplaza los anteriores)',
    isArray: true,
    enum: TipoRol,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TipoRol, { each: true })
  roles?: TipoRol[];
}
