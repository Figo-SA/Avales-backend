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
import { AvalTecnicosModule } from './modules/aval-tecnicos/aval-tecnicos.module';
import { CertificadoPdaModule } from './modules/certificado-pda/certificado-pda.module';
import { RevisionDtmModule } from './modules/revision-dtm/revision-dtm.module';
import { CertificadoFinancieroModule } from './modules/certificado-financiero/certificado-financiero.module';
import { SeedingModule } from './modules/seeding/seeding.module';

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
    AvalTecnicosModule,
    CertificadoPdaModule,
    RevisionDtmModule,
    CertificadoFinancieroModule,
    SeedingModule,
  ],
  controllers: [],
  providers: [ResponseInterceptor],
})
export class AppModule {}
