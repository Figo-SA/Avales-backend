// dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsNotEmpty,
  MinLength,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserEditableDto } from './user-editable.dto';

export class CreateUserDto extends UserEditableDto {
  @ApiProperty({
    example: 'SecurePass123!',
    description:
      'Contraseña del usuario. Será hasheada antes de almacenarse en la base de datos.',
    minLength: 6,
    maxLength: 32,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Length(6, 32, {
    message: 'La contraseña debe tener entre 6 y 32 caracteres',
  })
  password: string;

  // Override para hacer obligatorio el campo rolIds en creación
  @ApiProperty({
    example: [3, 7],
    description:
      'Array de IDs de roles a asignar al usuario. Mínimo 1 rol requerido. Cada rol debe existir en la tabla de roles.',
    type: [Number],
    isArray: true,
    minimum: 1,
    required: true,
  })
  @IsArray({ message: 'rolIds debe ser un array' })
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un rol' })
  @Type(() => Number)
  @IsNotEmpty({ message: 'Los roles son obligatorios' })
  declare rolIds: number[];
}
