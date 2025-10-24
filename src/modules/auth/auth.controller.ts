// src/auth/auth.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { UsuarioConRoles } from './interfaces/usuario-roles';
import { GetUser } from './decorators/get-user.decorator';
import {
  Auth,
  ApiLogin,
  ApiCheckStatus,
  ApiGetProfile,
  ApiForgotPassword,
  ApiResetPassword,
  ApiChangePassword,
} from './decorators';
import { cleanUser } from 'src/common/herlpers/clean-user';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Usuario } from '@prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';

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
  @ApiForgotPassword()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiResetPassword()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('change-password')
  @Auth()
  @ApiChangePassword()
  changePassword(
    @GetUser() user: UsuarioConRoles,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, changePasswordDto);
  }
}
