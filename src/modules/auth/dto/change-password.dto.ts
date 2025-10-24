import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'currentPassword123',
    description: 'Contraseña actual del usuario',
  })
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  currentPassword: string;

  @ApiProperty({
    example: 'newPassword123',
    description: 'Nueva contraseña del usuario',
  })
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  newPassword: string;
}
