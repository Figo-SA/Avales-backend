// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BaseService } from 'src/common/services/base.service';
import { PrismaService } from 'src/prisma/prisma.service';

export interface JwtPayload {
  id: number;
  email: string;
}

@Injectable()
export class AuthService extends BaseService<'usuario'> {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {
    super('usuario');
  }

  async login(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (password !== usuario.password) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload: JwtPayload = { id: usuario.id, email: usuario.email };
    const token = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    return {
      token,
      id: usuario.id,
      email: usuario.email,
    };
  }
}
