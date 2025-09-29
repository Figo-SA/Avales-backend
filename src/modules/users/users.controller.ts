import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  UseInterceptors,
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
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { ResponseInterceptor } from 'src/common/interceptors/response/response.interceptor';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

@Controller('users')
@ApiTags('users')
@ApiExtraModels(ResponseUserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SuccessMessage('Usuario creado correctamente')
  @Post('create')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  // @ApiBearerAuth('JWT')
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
  create(@Body() CreateUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.usersService.create(CreateUserDto);
  }

  @Get()
  @SuccessMessage('Datos de usuarios obtenidos correctamente')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
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
  // @UseInterceptors(ResponseInterceptor)
  async findAll(@Query() paginationDto: PaginationQueryDto) {
    return await this.usersService.findAllPaginated(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get(':id')
  @SuccessMessage('Datos del usuario obtenidos correctamente')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
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
          type: 'object',
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
  findOne(
    @Param('id') id: string,
  ): Promise<ResponseUserDto | ErrorResponseDto> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @SuccessMessage('Usuario actualizado correctamente')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
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
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @SuccessMessage('Usuario eliminado correctamente')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
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
  remove(@Param('id') id: string): Promise<{ id: number }> {
    return this.usersService.softDelete(+id);
  }
}
