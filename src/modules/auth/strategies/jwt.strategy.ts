// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the configuration');
    }

    // extractor personalizado: primero cookie, luego header Bearer
    const cookieOrHeaderExtractor = (req: Request): string | null => {
      if (!req) return null;

      // 1) Cookie HttpOnly "token" (para tu frontend web)
      if (req.cookies && req.cookies['token']) {
        return req.cookies['token'] as string;
      }

      // 2) Authorization: Bearer xxx (para tu app móvil, Swagger, Postman)
      const authHeader = req.headers['authorization'];
      if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7);
      }

      return null;
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([cookieOrHeaderExtractor]),
      // si quieres, podrías añadir más extractores en el array
    });
  }

  async validate(payload: JwtPayload) {
    const { usuarioId, email } = payload;
    const user = await this.prisma.usuario.findUnique({
      where: { id: usuarioId, email },
      include: {
        usuariosRol: {
          include: {
            rol: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Token inválido o usuario no encontrado');
    }

    if (user.deleted) {
      throw new UnauthorizedException('Usuario eliminado o inactivo');
    }

    // Lo que retornes aquí se asigna a request.user
    return user;
  }
}
