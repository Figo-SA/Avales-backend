import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { UserBaseDto } from './user-base.dto';

/**
 * DTO para actualizar el perfil del usuario autenticado
 */
export class UpdateUserProfileDto extends PartialType(UserBaseDto) {
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
}
