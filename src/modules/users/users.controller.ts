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
  async create(
    @Body() CreateUserDto: CreateUserDto,
  ): Promise<ApiResponseDto<ResponseUserDto>> {
    try {
      const usuario = await this.usersService.create(CreateUserDto);
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
  async findAll(): Promise<ApiResponseDto<ResponseUserDto[]>> {
    const users = await this.usersService.findAll();
    return {
      status: 'success',
      message: 'Usuarios obtenidos correctamente',
      data: users,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
