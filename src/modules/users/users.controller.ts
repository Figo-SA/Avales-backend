// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponsePaginated,
} from 'src/common/swagger/decorators/api-success-responses.decorator';
import { DeletedResourceDto } from 'src/common/dtos/deleted-resource.dto';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';
import {
  ApiResponseDto,
  GlobalMetaDto,
} from 'src/common/dtos/api-response.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Usuario creado correctamente')
  @ApiOperation({ summary: 'Crea un nuevo usuario (solo administradores)' })
  @ApiCreatedResponseData(
    ResponseUserDto,
    undefined,
    'Usuario creado correctamente',
    true,
  )
  @ApiErrorResponsesConfig([400, 401, 403, 409, 422, 500], {
    409: {
      type: 'https://api.tu-dominio.com/errors/conflict',
      title: 'Conflict',
      status: 409,
      detail: 'El email ya existe',
      instance: '/api/v1/users/create',
      apiVersion: 'v1',
    },
    422: {
      type: 'https://api.tu-dominio.com/errors/unprocessable-entity',
      title: 'Unprocessable Entity',
      status: 422,
      detail: 'Reglas de dominio no cumplidas',
      instance: '/api/v1/users/create',
      apiVersion: 'v1',
    },
  })
  create(@Body() dto: CreateUserDto): Promise<ResponseUserDto> {
    return this.usersService.create(dto);
  }

  @Get('paginated')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Datos de usuarios obtenidos correctamente (paginado)')
  @ApiOperation({
    summary: 'Obtiene la lista de usuarios (paginado)',
  })
  @ApiOkResponsePaginated(
    ResponseUserDto,
    undefined,
    'Usuarios obtenidos correctamente',
    true,
  )
  @ApiErrorResponsesConfig([401, 403, 500])
  async findAllPaginated(@Query() paginationDto: PaginationQueryDto) {
    return this.usersService.findAllPaginated(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get()
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Datos de usuarios obtenidos correctamente')
  @ApiOperation({
    summary: 'Obtiene la lista de todos los usuarios (sin paginar)',
  })
  @ApiExtraModels(ApiResponseDto, GlobalMetaDto, ResponseUserDto)
  @ApiOkResponse({
    description: 'Lista de usuarios obtenida correctamente',
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponseDto) },
            {
              properties: {
                message: {
                  type: 'string',
                  example: 'Datos de usuarios obtenidos correctamente',
                },
                meta: { $ref: getSchemaPath(GlobalMetaDto) },
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(ResponseUserDto) },
                },
              },
            },
          ],
        },
      },
    },
  })
  @ApiErrorResponsesConfig([401, 403, 500])
  findAll(): Promise<ResponseUserDto[]> {
    return this.usersService.findAll();
  }

  @Get('deleted')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Usuarios eliminados obtenidos correctamente')
  @ApiOperation({
    summary: 'Obtiene la lista de usuarios eliminados (soft deleted)',
  })
  @ApiExtraModels(ApiResponseDto, GlobalMetaDto, ResponseUserDto)
  @ApiOkResponse({
    description: 'Lista de usuarios eliminados obtenida correctamente',
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponseDto) },
            {
              properties: {
                message: {
                  type: 'string',
                  example: 'Usuarios eliminados obtenidos correctamente',
                },
                meta: { $ref: getSchemaPath(GlobalMetaDto) },
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(ResponseUserDto) },
                },
              },
            },
          ],
        },
      },
    },
  })
  @ApiErrorResponsesConfig([401, 403, 500])
  findDeleted(): Promise<ResponseUserDto[]> {
    return this.usersService.findDeleted();
  }

  @Get(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Datos del usuario obtenidos correctamente')
  @ApiOperation({
    summary: 'Obtiene los detalles de un usuario por ID (solo administradores)',
  })
  @ApiOkResponseData(
    ResponseUserDto,
    undefined,
    'Usuario obtenido correctamente',
    true,
  )
  @ApiErrorResponsesConfig([401, 403, 404, 500], {
    404: {
      type: 'https://api.tu-dominio.com/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'No existe un usuario con ese id',
      instance: '/api/v1/users/{id}',
      apiVersion: 'v1',
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseUserDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Usuario actualizado correctamente')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiOkResponseData(
    ResponseUserDto,
    undefined,
    'Usuario actualizado correctamente',
    true,
  )
  @ApiErrorResponsesConfig([400, 401, 403, 404, 409, 422, 500], {
    404: {
      type: 'https://api.tu-dominio.com/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'No existe un usuario con ese id',
      instance: '/api/v1/users/{id}',
      apiVersion: 'v1',
    },
    409: {
      type: 'https://api.tu-dominio.com/errors/conflict',
      title: 'Conflict',
      status: 409,
      detail: 'El email ya esta en uso por otro usuario',
      instance: '/api/v1/users/{id}',
      apiVersion: 'v1',
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Usuario deshabilitado correctamente')
  @ApiOperation({ summary: 'Deshabilitar (borrado logico) un usuario' })
  @ApiOkResponseData(
    DeletedResourceDto,
    undefined,
    'Usuario deshabilitado correctamente',
    true,
  )
  @ApiErrorResponsesConfig([401, 403, 404, 500], {
    404: {
      type: 'https://api.tu-dominio.com/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'No existe un usuario activo con ese id',
      instance: '/api/v1/users/{id}',
      apiVersion: 'v1',
    },
  })
  softDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeletedResourceDto> {
    return this.usersService.softDelete(id);
  }

  @Delete(':id/hard')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Usuario eliminado permanentemente')
  @ApiOperation({ summary: 'Eliminar un usuario de forma permanente' })
  @ApiNoContentResponse({ description: 'Eliminado permanentemente' })
  @ApiErrorResponsesConfig([401, 403, 404, 409, 500], {
    404: {
      type: 'https://api.tu-dominio.com/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'No existe un usuario activo con ese id',
      instance: '/api/v1/users/{id}/hard',
      apiVersion: 'v1',
    },
    409: {
      type: 'https://api.tu-dominio.com/errors/conflict',
      title: 'Conflict',
      status: 409,
      detail: 'No se puede eliminar: dependencias existentes',
      instance: '/api/v1/users/{id}/hard',
      apiVersion: 'v1',
    },
  })
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }

  @Post(':id/restore')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Usuario restaurado correctamente')
  @ApiOperation({ summary: 'Restaurar un usuario eliminado' })
  @ApiOkResponseData(
    ResponseUserDto,
    undefined,
    'Usuario restaurado correctamente',
    true,
  )
  @ApiErrorResponsesConfig([401, 403, 404, 500], {
    404: {
      type: 'https://api.tu-dominio.com/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'No existe un usuario eliminado con ese id',
      instance: '/api/v1/users/{id}',
      apiVersion: 'v1',
    },
  })
  restore(@Param('id', ParseIntPipe) id: number): Promise<ResponseUserDto> {
    return this.usersService.restore(id);
  }
}
