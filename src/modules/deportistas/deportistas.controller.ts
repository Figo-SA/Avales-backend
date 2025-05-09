import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
  HttpStatus,
} from '@nestjs/common';
import { DeportistasService } from './deportistas.service';
import { CreateDeportistaDto } from './dto/create-deportista.dto';
import { UpdateDeportistaDto } from './dto/update-deportista.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { ResponseDeportistaDto } from './dto/response-deportista.dto';

@Controller('deportistas')
@ApiExtraModels(CreateDeportistaDto)
export class DeportistasController {
  constructor(private readonly deportistasService: DeportistasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('roles', ['admin', 'entrenador'])
  @ApiBearerAuth('JWT')
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
    console.log(
      'Datos recibidos en el controlador para crear deportista:',
      createDeportistaDto,
    );
    return this.deportistasService.create(createDeportistaDto);
  }

  @Get()
  findAll() {
    return this.deportistasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deportistasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeportistaDto: UpdateDeportistaDto,
  ) {
    return this.deportistasService.update(+id, updateDeportistaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deportistasService.remove(+id);
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
