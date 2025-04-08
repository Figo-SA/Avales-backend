import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';

@Module({
  imports: [AuthModule, UsuariosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
