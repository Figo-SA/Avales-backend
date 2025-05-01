// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BaseService } from 'src/common/services/base.service';
import { PasswordService } from 'src/common/services/password/password.service';
import { PrismaService } from 'src/prisma/prisma.service';

export interface JwtPayload {
  usuarioId: number;
  email: string;
  rol: string;
}

@Injectable()
export class AuthService extends BaseService<'usuario'> {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {
    super('usuario');
  }

  async login(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: {
        UsuariosRol: {
          include: { Rol: true },
        },
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordMatch = await this.passwordService.comparePassword(
      password,
      usuario.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const rol = usuario.UsuariosRol[0]?.Rol.nombre || 'user';

    const payload: JwtPayload = {
      usuarioId: usuario.id,
      email: usuario.email,
      rol: rol,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    return {
      token,
    };
  }
}
