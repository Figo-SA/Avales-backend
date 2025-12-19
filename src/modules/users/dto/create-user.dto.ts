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
import { TipoRol } from '@prisma/client';
import { UserEditableDto } from './user-editable.dto';

export class CreateUserDto extends UserEditableDto {
  @ApiProperty({
    example: 'SecurePass123!',
    description:
      'Contrase¤a del usuario. Ser  hasheada antes de almacenarse en la base de datos.',
    minLength: 6,
    maxLength: 32,
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contrase¤a es obligatoria' })
  @MinLength(6, { message: 'La contrase¤a debe tener al menos 6 caracteres' })
  @Length(6, 32, {
    message: 'La contrase¤a debe tener entre 6 y 32 caracteres',
  })
  password: string;

  // Override para hacer obligatorio el campo de roles en creaci¢n
  @ApiProperty({
    example: [TipoRol.ADMIN, TipoRol.SECRETARIA],
    description:
      'Array de nombres de roles a asignar al usuario. M¡nimo 1 rol requerido. Cada rol debe existir en la tabla de roles.',
    enum: TipoRol,
    isArray: true,
    required: true,
  })
  @IsArray({ message: 'roles debe ser un array' })
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un rol' })
  @IsNotEmpty({ message: 'Los roles son obligatorios' })
  declare roles: TipoRol[];
}
