import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/crearUsuario.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiResponseDto,
  ErrorResponseDto,
} from '../../common/dtos/api-response.dto';
import { UsuariosResponseDto } from './dto/respuestaUsuario.dto';

@ApiTags('Usuarios')
@Controller('usuarios')
@ApiExtraModels(UsuariosResponseDto, ErrorResponseDto, ApiResponseDto)
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
        status: {
          type: 'string',
          example: 'success',
          enum: ['success', 'error'],
        },
        message: {
          type: 'string',
          example: 'Usuario creado correctamente',
        },
        data: {
          type: 'object',
          $ref: '#/components/schemas/UsuariosResponseDto',
        },
      },
      required: ['status', 'message', 'data'],
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Correo electrónico o cédula ya registrados',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado (requiere autenticación JWT)',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Acceso denegado (usuario no tiene rol de administrador)',
    type: ErrorResponseDto,
  })
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<ApiResponseDto<UsuariosResponseDto>> {
    try {
      const usuario = await this.usuariosService.create(createUsuarioDto);
      return {
        status: 'success',
        message: 'Usuario creado correctamente',
        data: usuario,
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error al crear el usuario',
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('roles', ['admin'])
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Obtiene la lista de todos los usuarios (solo administradores)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'success',
          enum: ['success', 'error'],
        },
        message: {
          type: 'string',
          example: 'Usuarios obtenidos correctamente',
        },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/UsuariosResponseDto' },
        },
      },
      required: ['status', 'message', 'data'],
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'No autorizado (requiere autenticación JWT y rol de administrador)',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No se encontraron usuarios',
    type: ErrorResponseDto,
  })
  async getAll(): Promise<ApiResponseDto<UsuariosResponseDto[]>> {
    const users = await this.usuariosService.getAllUsuarios();
    return {
      status: 'success',
      message: 'Usuarios obtenidos correctamente',
      data: users,
    };
  }
}
