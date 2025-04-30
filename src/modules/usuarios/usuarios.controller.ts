import {
  Body,
  Controller,
  HttpStatus,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import {
  CreateUsuarioDto,
  UsuarioResponseDto,
} from '../usuarios/dto/usuario.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('roles', ['admin'])
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Crea un nuevo usuario (solo administradores)' })
  @ApiBody({ type: CreateUsuarioDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuario creado correctamente' },
        id: { type: 'number', example: 12 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Correo electrónico o cédula ya registrados',
  })
  @ApiResponse({
    status: 401,
    description:
      'No autorizado (requiere autenticación JWT y rol de administrador)',
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado (usuario no tiene rol de administrador)',
  })
  register(
    @Body() createUsuairoDto: CreateUsuarioDto,
  ): Promise<{ message: string; id: number }> {
    return this.usuariosService.create(createUsuairoDto);
  }
}
