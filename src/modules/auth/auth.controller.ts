// src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Inicia sesión y obtiene un token JWT' })
  @ApiBody({
    description: 'Credenciales de inicio de sesión del usuario',
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Token JWT generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Credenciales inválidas (usuario no encontrado o contraseña incorrecta)',
  })
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
