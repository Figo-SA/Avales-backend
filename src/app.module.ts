import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ValidationService } from './common/services/validation/validation.service';
import { PasswordService } from './common/services/password/password.service';
import { CommonModule } from './common/common.module';
// import { UsuariosModule } from './usuarios/usuarios.module';
import { UsersModule } from './modules/users/users.module';
import { DeportistasModule } from './modules/deportistas/deportistas.module';
import { response } from 'express';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';

@Module({
  imports: [
    AuthModule,
    // UsuariosModule,
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
    CommonModule,
    UsersModule,
    DeportistasModule,
  ],
  controllers: [],
  providers: [ValidationService, PasswordService, ResponseInterceptor],
})
export class AppModule {}
