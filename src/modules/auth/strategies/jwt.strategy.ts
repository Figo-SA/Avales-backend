// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      secretOrKey: jwtSecret,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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

    if (user.deleted)
      throw new UnauthorizedException('Usuario eliminado o inactivo');

    return user;
  }
}
