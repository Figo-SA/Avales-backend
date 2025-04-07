// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient(); // Lo puedes mejorar luego usando un módulo

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (password !== usuario.password) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { id: usuario.id, email: usuario.email };
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
