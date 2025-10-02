// src/auth/dto/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 6 })
  id: number;

  @ApiProperty({ example: 'superadmin@ejemplo.com' })
  email: string;

  @ApiProperty({ example: 'Super' })
  nombre: string;

  @ApiProperty({ example: 'Admin' })
  apellido: string;

  @ApiProperty({ example: '1234567890' })
  cedula: string;

  @ApiProperty({ example: ['SUPER_ADMIN'] })
  roles: string[];

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvSWQiOjYsImVtYWlsIjoic3VwZXJhZG1pbkBlamVtcGxvLmNvbSIsImlhdCI6MTY5NjI5OD...',
  })
  token: string;
}
