import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { PasswordService } from 'src/common/services/password/password.service';
import { ValidationService } from 'src/common/services/validation/validation.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [UsuariosController],
  providers: [UsuariosService, ValidationService, PasswordService],
})
export class UsuariosModule {}
