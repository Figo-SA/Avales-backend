import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { DeportistasService } from './deportistas.service';
import { CreateDeportistaDto } from './dto/create-deportista.dto';
import { UpdateDeportistaDto } from './dto/update-deportista.dto';

import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
  ApiBearerAuth,
  ApiTags,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import {
  ApiResponseDto,
  GlobalMetaDto,
} from 'src/common/dtos/api-response.dto';
import { ResponseDeportistaDto } from './dto/response-deportista.dto';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { Auth } from '../auth/decorators';
import { ProblemDetailsDto } from 'src/common/dtos/problem-details.dto';
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponsePaginated,
} from 'src/common/swagger/decorators/api-success-responses.decorator';
import { DeletedResourceDto } from 'src/common/dtos/deleted-resource.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
// (consolidated imports above)
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';
// ... existing ApiResponseDto / GlobalMetaDto are already imported above

@Controller('deportistas')
@ApiTags('deportistas')
@ApiBearerAuth()
@ApiExtraModels(CreateDeportistaDto)
export class DeportistasController {
  constructor(private readonly deportistasService: DeportistasService) {}

  @Post()
  @Auth(ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.entrenador)
  @ApiOperation({ summary: 'Crear deportista' })
  @ApiBody({
    description: 'Datos del deportista a crear',
    type: CreateDeportistaDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Body inválido (class-validator)',
    content: {
      'application/problem+json': {
        schema: { $ref: getSchemaPath(ProblemDetailsDto) },
      },
    },
  })
  @ApiCreatedResponseData(
    ResponseDeportistaDto,
    undefined,
    'Deportista creado',
    true,
  )
  @ApiErrorResponsesConfig([400, 401, 403, 409, 422, 500], {
    409: {
      type: 'https://api.tu-dominio.com/errors/conflict',
      title: 'Conflict',
      status: 409,
      detail: 'La cédula ya existe',
      instance: '/api/v1/deportistas',
      apiVersion: 'v1',
    },
    422: {
      type: 'https://api.tu-dominio.com/errors/unprocessable-entity',
      title: 'Unprocessable Entity',
      status: 422,
      detail: 'Reglas de dominio no cumplidas',
      instance: '/api/v1/deportistas',
      apiVersion: 'v1',
    },
  })
  create(
    @Body() createDeportistaDto: CreateDeportistaDto,
  ): Promise<ResponseDeportistaDto> {
    console.log('Creando deportista con datos:', createDeportistaDto);
    return this.deportistasService.create(createDeportistaDto);
  }

  @Get('paginated')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.entrenador)
  @ApiOperation({ summary: 'Obtener deportistas (paginado)' })
  @ApiOkResponsePaginated(
    ResponseDeportistaDto,
    undefined,
    'Deportistas obtenidos correctamente',
    true,
  )
  @ApiErrorResponsesConfig([401, 403, 500])
  async findAllPaginated(@Query() paginationDto: PaginationQueryDto) {
    return this.deportistasService.findAllPaginated(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get()
  @Auth(ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.entrenador)
  @ApiOperation({ summary: 'Obtener todos los deportistas' })
  // success (200) con wrapper y data = array de ResponseDeportistaDto
  @ApiOkResponse({
    description: 'Lista de deportistas obtenida correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            message: {
              type: 'string',
              example: 'Datos de deportistas obtenidos correctamente',
            },
            meta: { $ref: getSchemaPath(GlobalMetaDto) },
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ResponseDeportistaDto) },
            },
          },
        },
      ],
    },
  })
  @ApiErrorResponsesConfig([401, 403, 500])
  findAll(): Promise<ResponseDeportistaDto[]> {
    return this.deportistasService.findAll();
  }

  @Get('deleted')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.entrenador)
  @SuccessMessage('Deportistas eliminados obtenidos correctamente')
  @ApiOperation({
    summary: 'Obtiene la lista de deportistas eliminados (soft deleted)',
  })
  @ApiExtraModels(ApiResponseDto, GlobalMetaDto, ResponseDeportistaDto)
  @ApiOkResponse({
    description: 'Lista de deportistas eliminados obtenida correctamente',
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponseDto) },
            {
              properties: {
                message: {
                  type: 'string',
                  example: 'Deportistas eliminados obtenidos correctamente',
                },
                meta: { $ref: getSchemaPath(GlobalMetaDto) },
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(ResponseDeportistaDto) },
                },
              },
            },
          ],
        },
      },
    },
  })
  @ApiErrorResponsesConfig([401, 403, 500])
  findDeleted(): Promise<ResponseDeportistaDto[]> {
    return this.deportistasService.findDeleted();
  }

  @Get(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.entrenador)
  @ApiOperation({ summary: 'Obtener deportista por ID' })
  @ApiOkResponseData(
    ResponseDeportistaDto,
    undefined,
    'Deportista obtenido',
    true,
  )
  @ApiErrorResponsesConfig([401, 403, 404, 500], {
    404: {
      type: 'https://api.tu-dominio.com/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'No existe un deportista con ese id',
      instance: '/api/v1/deportistas/{id}',
      apiVersion: 'v1',
    },
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDeportistaDto> {
    return this.deportistasService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.entrenador)
  @ApiOperation({ summary: 'Actualizar deportista' })
  @ApiOkResponseData(
    ResponseDeportistaDto,
    undefined,
    'Deportista obtenido',
    true,
  )
  @ApiErrorResponsesConfig([400, 401, 403, 404, 409, 422, 500], {
    404: {
      type: 'https://api.tu-dominio.com/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'No existe un deportista con ese id',
      instance: '/api/v1/deportistas/{id}',
      apiVersion: 'v1',
    },
    409: {
      type: 'https://api.tu-dominio.com/errors/conflict',
      title: 'Conflict',
      status: 409,
      detail: 'La cédula ya está en uso por otro deportista',
      instance: '/api/v1/deportistas/{id}',
      apiVersion: 'v1',
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeportistaDto: UpdateDeportistaDto,
  ): Promise<ResponseDeportistaDto> {
    return this.deportistasService.update(id, updateDeportistaDto as any);
  }

  @Delete(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.entrenador)
  @SuccessMessage('Deportista deshabilitado correctamente')
  @ApiOperation({ summary: 'Deshabilitar (borrado lógico) un deportista' })
  // Aquí devuelves `data: string`. Lo documentamos manualmente:
  @ApiOkResponse({
    description: 'Deportista eliminado exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            message: {
              type: 'string',
              example: 'Deportista eliminado correctamente',
            },
            meta: { $ref: getSchemaPath(GlobalMetaDto) },
            data: {
              type: 'object',
              properties: { id: { type: 'number', example: 1 } },
              example: { id: 1 },
            },
          },
        },
      ],
    },
  })
  @ApiErrorResponsesConfig([401, 403, 404, 500], {
    404: {
      type: 'https://api.tu-dominio.com/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'No existe un deportista activo con ese id',
      instance: '/api/v1/deportistas/{id}',
      apiVersion: 'v1',
    },
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<DeletedResourceDto> {
    return this.deportistasService.softDelete(id);
  }

  @Delete(':id/hard')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.entrenador)
  @SuccessMessage('Deportista eliminado permanentemente')
  @ApiOperation({ summary: 'Eliminar deportista de forma permanente' })
  @ApiNoContentResponse({ description: 'Eliminado permanentemente' })
  @ApiErrorResponsesConfig([401, 403, 404, 409, 500])
  @HttpCode(204)
  async hardRemove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deportistasService.remove(id);
  }

  @Post(':id/restore')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.entrenador)
  @SuccessMessage('Deportista restaurado correctamente')
  @ApiOperation({ summary: 'Restaurar un deportista eliminado' })
  @ApiOkResponseData(
    ResponseDeportistaDto,
    undefined,
    'Deportista restaurado correctamente',
    true,
  )
  @ApiErrorResponsesConfig([401, 403, 404, 500])
  restore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResponseDeportistaDto> {
    return this.deportistasService.restore(id);
  }

  // @Put(':id/afiliate')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @SetMetadata('roles', ['admin'])
  // @ApiBearerAuth('JWT')
  // @ApiOperation({ summary: 'Afiliar un usuario' })
  // @ApiResponse({
  //   status: HttpStatus.CREATED,
  //   description: 'Usuario afiliado exitosamente',
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       status: {
  //         type: 'string',
  //         example: 'success',
  //         enum: ['success', 'error'],
  //       },
  //       message: {
  //         type: 'string',
  //         example: 'Usuario afiliado correctamente',
  //       },
  //       data: {
  //         type: 'object',
  //         $ref: '#/components/schemas/ResponseUserDto',
  //       },
  //     },
  //     required: ['status', 'message', 'data'],
  //   },
  // })
  // @ApiResponse({
  //   status: HttpStatus.BAD_REQUEST,
  //   description: 'Correo electrónico o cédula ya registrados',
  //   type: ErrorResponseDto,
  // })
  // @ApiResponse({
  //   status: HttpStatus.UNAUTHORIZED,
  //   description: 'No autorizado (requiere autenticación JWT)',
  //   type: ErrorResponseDto,
  // })
  // @ApiResponse({
  //   status: HttpStatus.FORBIDDEN,
  //   description: 'Acceso denegado (usuario no tiene rol de administrador)',
  //   type: ErrorResponseDto,
  // })
  // async afiliate(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<ResponseUserDto> {
  //   return await this.usersService.afiliate(+id, updateUserDto);
  // }
}
