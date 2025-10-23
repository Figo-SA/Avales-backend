import { IsNotEmpty, IsString, MinLength, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email del usuario',
  })
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Código de 6 dígitos recibido por email',
  })
  @IsString()
  @Length(6, 6, { message: 'El código debe tener exactamente 6 dígitos' })
  @IsNotEmpty({ message: 'El código es requerido' })
  code: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Nueva contraseña',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  newPassword: string;
}
