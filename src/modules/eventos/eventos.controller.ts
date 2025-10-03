import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { ResponseEventoDto } from './dto/response-evento.dto';
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

@Controller('eventos')
@ApiTags('eventos')
@ApiBearerAuth()
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Evento creado correctamente')
  @ApiOperation({ summary: 'Crear un evento' })
  @ApiCreatedResponseData(
    ResponseEventoDto,
    undefined,
    'Evento creado correctamente',
    true,
  )
  @ApiErrorResponsesConfig([400, 401, 403, 409, 422, 500])
  create(@Body() dto: CreateEventoDto): Promise<ResponseEventoDto> {
    return this.eventosService.create(dto);
  }

  @Get('paginated')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Datos de eventos obtenidos correctamente (paginado)')
  @ApiOperation({ summary: 'Obtiene la lista de eventos (paginado)' })
  @ApiOkResponsePaginated(
    ResponseEventoDto,
    undefined,
    'Eventos obtenidos correctamente',
    true,
  )
  @ApiErrorResponsesConfig([401, 403, 500])
  async findAllPaginated(@Query() paginationDto: PaginationQueryDto) {
    return this.eventosService.findAllPaginated(
      paginationDto.page,
      paginationDto.limit,
    );
  }

  @Get()
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Datos de eventos obtenidos correctamente')
  @ApiOperation({
    summary: 'Obtiene la lista de todos los eventos (sin paginar)',
  })
  @ApiExtraModels(ApiResponseDto, GlobalMetaDto, ResponseEventoDto)
  @ApiOkResponse({
    description: 'Lista de eventos obtenida correctamente',
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponseDto) },
            {
              properties: {
                message: {
                  type: 'string',
                  example: 'Datos de eventos obtenidos correctamente',
                },
                meta: { $ref: getSchemaPath(GlobalMetaDto) },
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(ResponseEventoDto) },
                },
              },
            },
          ],
        },
      },
    },
  })
  @ApiErrorResponsesConfig([401, 403, 500])
  findAll(): Promise<ResponseEventoDto[]> {
    return this.eventosService.findAll();
  }

  @Get('deleted')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Eventos eliminados obtenidos correctamente')
  @ApiOperation({
    summary: 'Obtiene la lista de eventos eliminados (soft deleted)',
  })
  @ApiExtraModels(ApiResponseDto, GlobalMetaDto, ResponseEventoDto)
  @ApiOkResponse({
    description: 'Lista de eventos eliminados obtenida correctamente',
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponseDto) },
            {
              properties: {
                message: {
                  type: 'string',
                  example: 'Eventos eliminados obtenidos correctamente',
                },
                meta: { $ref: getSchemaPath(GlobalMetaDto) },
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(ResponseEventoDto) },
                },
              },
            },
          ],
        },
      },
    },
  })
  @ApiErrorResponsesConfig([401, 403, 500])
  findDeleted(): Promise<ResponseEventoDto[]> {
    return this.eventosService.findDeleted();
  }

  @Get(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Datos del evento obtenidos correctamente')
  @ApiOperation({ summary: 'Obtiene los detalles de un evento por ID' })
  @ApiOkResponseData(
    ResponseEventoDto,
    undefined,
    'Evento obtenido correctamente',
    true,
  )
  @ApiErrorResponsesConfig([401, 403, 404, 500], {
    404: {
      type: 'https://api.tu-dominio.com/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'No existe un evento con ese id',
      instance: '/api/v1/eventos/{id}',
      apiVersion: 'v1',
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseEventoDto> {
    return this.eventosService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Evento actualizado correctamente')
  @ApiOperation({ summary: 'Actualizar un evento' })
  @ApiOkResponseData(
    ResponseEventoDto,
    undefined,
    'Evento actualizado correctamente',
    true,
  )
  @ApiErrorResponsesConfig([400, 401, 403, 404, 409, 422, 500], {
    404: {
      type: 'https://api.tu-dominio.com/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'No existe un evento con ese id',
      instance: '/api/v1/eventos/{id}',
      apiVersion: 'v1',
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventoDto,
  ): Promise<ResponseEventoDto> {
    return this.eventosService.update(id, dto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Evento deshabilitado correctamente')
  @ApiOperation({ summary: 'Deshabilitar (borrado logico) un evento' })
  @ApiOkResponseData(
    DeletedResourceDto,
    undefined,
    'Evento deshabilitado correctamente',
    true,
  )
  @ApiErrorResponsesConfig([401, 403, 404, 500], {
    404: {
      type: 'https://api.tu-dominio.com/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'No existe un evento activo con ese id',
      instance: '/api/v1/eventos/{id}',
      apiVersion: 'v1',
    },
  })
  softDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeletedResourceDto> {
    return this.eventosService.softDelete(id);
  }

  @Delete(':id/hard')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Evento eliminado permanentemente')
  @ApiOperation({ summary: 'Eliminar un evento de forma permanente' })
  @ApiNoContentResponse({ description: 'Eliminado permanentemente' })
  @ApiErrorResponsesConfig([401, 403, 404, 409, 500])
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.eventosService.remove(id);
  }

  @Post(':id/restore')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  @SuccessMessage('Evento restaurado correctamente')
  @ApiOperation({ summary: 'Restaurar un evento eliminado' })
  @ApiOkResponseData(
    ResponseEventoDto,
    undefined,
    'Evento restaurado correctamente',
    true,
  )
  @ApiErrorResponsesConfig([401, 403, 404, 500], {
    404: {
      type: 'https://api.tu-dominio.com/errors/not-found',
      title: 'Not Found',
      status: 404,
      detail: 'No existe un evento eliminado con ese id',
      instance: '/api/v1/eventos/{id}',
      apiVersion: 'v1',
    },
  })
  restore(@Param('id', ParseIntPipe) id: number): Promise<ResponseEventoDto> {
    return this.eventosService.restore(id);
  }
}
