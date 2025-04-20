import { Body, Controller, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from '../auth/dto/usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('create')
  login(@Body() createUsuairoDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuairoDto);
  }
}
