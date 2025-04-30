import { Body, Controller, Post, SetMetadata, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from '../usuarios/dto/usuario.dto';
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
    status: 201,
    description: 'Usuario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'nuevo@ejemplo.com' },
        nombre: { type: 'string', example: 'Juan' },
        apellido: { type: 'string', example: 'Pérez' },
        cedula: { type: 'string', example: '1234567890' },
        categoria_id: { type: 'number', example: 1 },
        disciplina_id: { type: 'number', example: 1 },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-29T12:00:00Z',
        },
        updated_at: {
          type: 'string',
          format: 'date-time',
          example: '2025-04-29T12:00:00Z',
        },
        deleted: { type: 'boolean', example: false },
        Categoria: {
          type: 'object',
          properties: { id: { type: 'number' }, nombre: { type: 'string' } },
        },
        Disciplina: {
          type: 'object',
          properties: { id: { type: 'number' }, nombre: { type: 'string' } },
        },
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
  register(@Body() createUsuairoDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuairoDto);
  }
}
