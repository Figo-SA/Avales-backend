import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CommonModule } from './common/common.module';
// import { UsuariosModule } from './usuarios/usuarios.module';
import { UsersModule } from './modules/users/users.module';
import { DeportistasModule } from './modules/deportistas/deportistas.module';

import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { SeedingModule } from './modules/seeding/seeding.module';
import { GlobalExceptionFilter } from './common/filters/global-exception/global-exception.filter';
import { EventsModule } from './modules/events/events.module';
import { MailModule } from './modules/mail/mail.module';
import { PushNotificationsModule } from './modules/push-notifications/push-notifications.module';

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

    SeedingModule,

    EventsModule,

    MailModule,

    PushNotificationsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseInterceptor, //exitos
    },
    {
      provide: 'APP_FILTER',
      useClass: GlobalExceptionFilter, // errores RFC 7807
    },
  ],
})
export class AppModule {}
