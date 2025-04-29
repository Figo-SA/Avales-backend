import { Body, Controller, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from '../auth/dto/usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('roles', ['admin'])
  @Post('create')
  register(@Body() createUsuairoDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuairoDto);
  }
}
