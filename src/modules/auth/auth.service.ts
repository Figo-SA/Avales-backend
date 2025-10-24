// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { BaseService } from 'src/common/services/base.service';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UsuarioConRoles } from './interfaces/usuario-roles';
import { cleanUser } from 'src/common/herlpers/clean-user';
import { MailService } from 'src/modules/mail/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  InvalidCredentialsException,
  InvalidResetCodeException,
  InvalidCurrentPasswordException,
  EmailSendFailedException,
  UserNotFoundException,
} from './exceptions/auth.exceptions';

export interface JwtPayload {
  usuarioId: number;
  email: string;
}

@Injectable()
export class AuthService extends BaseService<'usuario'> {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailService: MailService,
  ) {
    super('usuario');
  }

  async login(loginUserDto: LoginDto) {
    const { email, password } = loginUserDto;
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
        nombre: true,
        apellido: true,
        cedula: true,
        categoriaId: true,
        disciplinaId: true,
        resetPasswordToken: true,
        resetPasswordExpires: true,
        createdAt: true,
        updatedAt: true,
        deleted: true,
        usuariosRol: {
          select: {
            rol: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });

    if (!usuario) {
      throw new InvalidCredentialsException();
    }

    if (!bcrypt.compareSync(password, usuario.password)) {
      throw new InvalidCredentialsException();
    }

    return {
      ...cleanUser(usuario),
      token: this.getJwtToken({ usuarioId: usuario.id, email: usuario.email }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  checkAuthStatus(user: UsuarioConRoles) {
    return {
      ...cleanUser(user),
      token: this.getJwtToken({
        usuarioId: user.id,
        email: user.email,
      }),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      // Por seguridad, no revelar si el email existe o no
      return {
        message:
          'Si el email existe en nuestro sistema, recibirás un código de verificación',
      };
    }

    // Generar código de 6 dígitos
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    // Código expira en 15 minutos
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Guardar código en la base de datos
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        resetPasswordToken: hashedCode,
        resetPasswordExpires: expiresAt,
      },
    });

    // Enviar email con el código
    try {
      await this.mailService.sendPasswordResetEmail(email, resetCode);
    } catch (error) {
      // Si falla el envío del email, eliminar el código
      await this.prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });
      throw new EmailSendFailedException();
    }

    return {
      message:
        'Si el email existe en nuestro sistema, recibirás un código de verificación',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, code, newPassword } = resetPasswordDto;

    // Hash del código para comparar con el de la BD
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');

    const usuario = await this.prisma.usuario.findFirst({
      where: {
        email: email,
        resetPasswordToken: hashedCode,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!usuario) {
      throw new InvalidResetCodeException();
    }

    // Hash de la nueva contraseña
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Actualizar contraseña y limpiar código
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return {
      message: 'Contraseña actualizada exitosamente',
    };
  }

  async changePassword(
    usuarioId: number,
    changePasswordDto: ChangePasswordDto,
  ) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    const { currentPassword, newPassword } = changePasswordDto;
    if (!usuario) {
      throw new UserNotFoundException();
    }

    if (!bcrypt.compareSync(currentPassword, usuario.password)) {
      throw new InvalidCurrentPasswordException();
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

    await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { password: hashedNewPassword },
    });

    return {
      message: 'Contraseña cambiada exitosamente',
    };
  }
}
