// src/auth/auth.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser } from './decorators';

import { ValidRoles } from './interfaces/valid-roles';
import { UsuarioConRoles } from './interfaces/usuario-roles';
import { cleanUser } from 'src/common/herlpers/clean-user';

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
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: UsuarioConRoles) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private3')
  @Auth(ValidRoles.superAdmin)
  privateRoute3(@GetUser() user: UsuarioConRoles) {
    return {
      ok: true,
      message: 'You have accessed a private route',
      user: cleanUser(user),
    };
  }
}
