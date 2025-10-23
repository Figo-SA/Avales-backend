// src/auth/auth.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { UsuarioConRoles } from './interfaces/usuario-roles';
import { GetUser } from './decorators/get-user.decorator';
import { Auth, ApiLogin, ApiCheckStatus, ApiGetProfile } from './decorators';
import { cleanUser } from 'src/common/herlpers/clean-user';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiLogin()
  login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('check-status')
  @Auth()
  @ApiCheckStatus()
  getStatus(@GetUser() user: UsuarioConRoles) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('profile')
  @Auth()
  @ApiGetProfile()
  getProfile(@GetUser() user: UsuarioConRoles) {
    return cleanUser(user);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar código de recuperación',
    description:
      'Envía un código de 6 dígitos al email del usuario para recuperar su contraseña',
  })
  @ApiBody({ type: ForgotPasswordDto })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Restablecer contraseña con código',
    description:
      'Restablece la contraseña usando el código de 6 dígitos recibido por email',
  })
  @ApiBody({ type: ResetPasswordDto })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
