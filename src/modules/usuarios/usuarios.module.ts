import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { PasswordService } from 'src/common/services/password.service';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, PasswordService],
})
export class UsuariosModule {}
