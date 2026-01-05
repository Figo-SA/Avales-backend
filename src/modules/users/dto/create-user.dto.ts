import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsNotEmpty,
  MinLength,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { TipoRol } from '@prisma/client';
import { UserBaseDto } from './user-base.dto';

/**
 * DTO para crear un nuevo usuario
 * Extiende del base y agrega password obligatorio
 */
export class CreateUserDto extends UserBaseDto {
  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Contraseña del usuario (será hasheada)',
    minLength: 6,
    maxLength: 32,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Length(6, 32, {
    message: 'La contraseña debe tener entre 6 y 32 caracteres',
  })
  password: string;

  @ApiProperty({
    example: [TipoRol.ADMIN, TipoRol.SECRETARIA],
    description: 'Array de roles a asignar. Mínimo 1 rol requerido.',
    enum: TipoRol,
    isArray: true,
  })
  @IsArray({ message: 'roles debe ser un array' })
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un rol' })
  @IsNotEmpty({ message: 'Los roles son obligatorios' })
  declare roles: TipoRol[];
}
