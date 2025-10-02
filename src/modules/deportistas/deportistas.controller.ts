import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
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
} from 'src/common/swagger/decorators/api-success-responses.decorator';

@Controller('deportistas')
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
  @ApiCreatedResponseData(ResponseDeportistaDto, {
    status: 'success',
    message: 'Deportista creado correctamente',
    meta: {
      requestId: 'd1b9abf7-8a1f-4c2d-b2e6-8a9f0c1d6a3e',
      timestamp: '2025-09-29T16:25:41Z',
      apiVersion: 'v1',
      durationMs: 42,
    },
    data: {
      id: 1,
      nombres: 'Juan',
      apellidos: 'Pérez',
    },
  })
  create(
    @Body() createDeportistaDto: CreateDeportistaDto,
  ): Promise<ResponseDeportistaDto> {
    console.log('Creando deportista con datos:', createDeportistaDto);
    return this.deportistasService.create(createDeportistaDto);
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
  findAll(): Promise<ResponseDeportistaDto[]> {
    return this.deportistasService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.entrenador)
  @ApiOperation({ summary: 'Obtener deportista por ID' })
  @ApiOkResponseData(ResponseDeportistaDto, {
    status: 'success',
    message: 'Deportista obtenido correctamente',
    meta: {
      requestId: 'd1b9abf7-8a1f-4c2d-b2e6-8a9f0c1d6a3e',
      timestamp: '2025-09-29T16:25:41Z',
      apiVersion: 'v1',
      durationMs: 17,
    },
    data: {
      id: 1,
      nombres: 'Juan',
      apellidos: 'Pérez',
      // ...
    },
  })
  findOne(@Param('id') id: string): Promise<ResponseDeportistaDto> {
    return this.deportistasService.findOne(+id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.entrenador)
  @ApiOperation({ summary: 'Actualizar deportista' })
  @ApiOkResponseData(ResponseDeportistaDto, {
    status: 'success',
    message: 'Deportista actualizado correctamente',
    meta: {
      requestId: 'd1b9abf7-8a1f-4c2d-b2e6-8a9f0c1d6a3e',
      timestamp: '2025-09-29T16:25:41Z',
      apiVersion: 'v1',
      durationMs: 25,
    },
    data: {
      id: 1,
      nombres: 'Juan',
      apellidos: 'Pérez',
      // ...
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateDeportistaDto: UpdateDeportistaDto,
  ) {
    return this.deportistasService.update(+id, updateDeportistaDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin, ValidRoles.entrenador)
  @ApiOperation({ summary: 'Eliminar deportista' })
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
              type: 'string',
              example: 'Deportista eliminado correctamente',
            },
          },
        },
      ],
    },
  })
  remove(@Param('id') id: string): Promise<string> {
    return this.deportistasService.softDelete(+id);
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
