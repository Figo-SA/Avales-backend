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
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  ApiResponseDto,
  ErrorResponseDto,
} from 'src/common/dtos/api-response.dto';
import { ResponseDeportistaDto } from './dto/response-deportista.dto';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { Auth } from '../auth/decorators';

@Controller('deportistas')
@ApiExtraModels(CreateDeportistaDto)
export class DeportistasController {
  constructor(private readonly deportistasService: DeportistasService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.entrenador)
  @SuccessMessage('Deportista creado correctamente')
  @ApiOperation({ summary: 'Crear deportista' })
  @ApiBody({
    description: 'Datos del deportista a crear',
    type: CreateDeportistaDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Deportista creado exitosamente',
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
          example: 'Deportista creado correctamente',
        },
        data: {
          type: 'object',
          $ref: '#/components/schemas/CreateDerportistaDto',
        },
      },
      required: ['status', 'message', 'data'],
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error al crear el deportista',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado (requiere autenticación JWT)',
    type: ApiResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Acceso prohibido',
    type: ApiResponseDto,
  })
  create(
    @Body() createDeportistaDto: CreateDeportistaDto,
  ): Promise<ResponseDeportistaDto> {
    return this.deportistasService.create(createDeportistaDto);
  }

  @Get()
  @SuccessMessage('Datos de deportistas obtenidos correctamente')
  @Auth(ValidRoles.admin, ValidRoles.entrenador)
  @ApiOperation({ summary: 'Obtener todos los deportistas' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de deportistas obtenida exitosamente',
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
          example: 'Lista de deportistas obtenida correctamente',
        },
        data: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/ResponseDeportistaDto',
          },
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
    description: 'Acceso prohibido',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error al obtener la lista de deportistas',
    type: ErrorResponseDto,
  })
  findAll(): Promise<ResponseDeportistaDto[]> {
    return this.deportistasService.findAll();
  }

  @Get(':id')
  @SuccessMessage('Datos de deportista obtenidos correctamente')
  @Auth(ValidRoles.admin, ValidRoles.entrenador)
  @ApiOperation({ summary: 'Obtener deportista por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deportista obtenido exitosamente',
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
          example: 'Deportista obtenido correctamente',
        },
        data: {
          type: 'object',
          $ref: '#/components/schemas/ResponseDeportistaDto',
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
    description: 'Acceso prohibido',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Deportista no encontrado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
    type: ErrorResponseDto,
  })
  findOne(@Param('id') id: string): Promise<ResponseDeportistaDto> {
    return this.deportistasService.findOne(+id);
  }

  @Patch(':id')
  @SuccessMessage('Deportista actualizado correctamente')
  @Auth(ValidRoles.admin, ValidRoles.entrenador)
  @ApiOperation({ summary: 'Actualizar deportista' })
  @ApiBody({
    description: 'Datos del deportista a actualizar',
    type: UpdateDeportistaDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deportista obtenido exitosamente',
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
          example: 'Deportista obtenido correctamente',
        },
        data: {
          type: 'object',
          $ref: '#/components/schemas/ResponseDeportistaDto',
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
    description: 'Acceso prohibido',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Deportista no encontrado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
    type: ErrorResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateDeportistaDto: UpdateDeportistaDto,
  ) {
    return this.deportistasService.update(+id, updateDeportistaDto);
  }

  @Delete(':id')
  @SuccessMessage('Deportista eliminado correctamente')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Eliminar deportista' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deportista eliminado exitosamente',
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
          example: 'Deportista eliminado correctamente',
        },
        data: {
          type: 'string',
          example: 'Deportista eliminado correctamente',
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
    description: 'Acceso prohibido',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Deportista no encontrado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
    type: ErrorResponseDto,
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
