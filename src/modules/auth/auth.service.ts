// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { BaseService } from 'src/common/services/base.service';

import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  usuarioId: number;
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

  async login(loginUserDto: LoginDto) {
    const { email, password } = loginUserDto;
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    if (!bcrypt.compareSync(password, usuario.password)) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    return {
      ...usuario,
      token: this.getJwtToken({ usuarioId: usuario.id, email: usuario.email }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
