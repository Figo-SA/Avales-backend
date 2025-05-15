import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  SetMetadata,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiResponseDto,
  ErrorResponseDto,
} from 'src/common/dtos/api-response.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { BaseUserDto } from './dto/base-user.dto';

@Controller('users')
@ApiTags('users')
@ApiExtraModels(ResponseUserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('roles', ['admin'])
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Crea un nuevo usuario (solo administradores)' })
  @ApiBody({ type: CreateUserDto })
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
          $ref: '#/components/schemas/ResponseUserDto',
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
  async create(@Body() CreateUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return await this.usersService.create(CreateUserDto);
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
          items: { $ref: '#/components/schemas/ResponseUserDto' },
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
  async findAll(): Promise<ResponseUserDto[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Obtiene los detalles de un usuario por ID (solo administradores)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalles del usuario obtenidos exitosamente',
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
          example: 'Usuario obtenido correctamente',
        },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ResponseUserDto' },
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
    description: 'No se encontro el usuario con el ID proporcionado',
    type: ErrorResponseDto,
  })
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponseUserDto | ErrorResponseDto> {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('roles', ['admin'])
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario actualizado exitosamente',
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
          example: 'Usuario actualizado correctamente',
        },
        data: {
          type: 'object',
          $ref: '#/components/schemas/ResponseUserDto',
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
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('roles', ['admin'])
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario eliminado exitosamente',
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
          example: 'Usuario eliminado correctamente',
        },
        data: {
          type: 'object',
          $ref: '#/components/schemas/ResponseUserDto',
        },
      },
      required: ['status', 'message', 'data'],
    },
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
  async remove(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<{ id: number }>> {
    const result = await this.usersService.softDelete(+id);

    return {
      status: 'success',
      message: 'Eliminado correctamente',
      data: result,
    };
  }
}
