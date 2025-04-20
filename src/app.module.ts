import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsuariosModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true, // Hace que esté disponible en toda la app
      load: [jwtConfig, databaseConfig], // Carga lo que exportaste desde `jwt.config.ts`
    }),
    ThrottlerModule.forRoot([
      {
        name: 'login',
        limit: 5,
        ttl: 60,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
