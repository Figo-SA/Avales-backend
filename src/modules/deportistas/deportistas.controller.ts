import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DeportistasService } from './deportistas.service';
import { ParticipantResponseDto } from './dto/participant-response.dto';
import { ApiOkResponseData } from 'src/common/swagger/decorators/api-success-responses.decorator';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import { DeportistaResponseDto } from './dto/deportista-response.dto';
import { CreateDeportistaDto } from './dto/create-deportista.dto';
import { UpdateDeportistaDto } from './dto/update-deportista.dto';
import { DeletedResourceDto } from 'src/common/dtos/deleted-resource.dto';

@ApiTags('Deportistas')
@Controller('deportistas')
export class DeportistasController {
  constructor(private readonly deportistasService: DeportistasService) {}
  @Get()
  @SuccessMessage('Deportistas obtenidos exitosamente')
  @ApiOperation({ summary: 'Listar deportistas (filtrable y paginado)' })
  @ApiQuery({
    name: 'sexo',
    required: false,
    description: 'Filtrar por sexo (M/F)',
  })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Buscar por nombres, apellidos o cédula',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Página (por defecto 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Resultados por página (por defecto 50)',
  })
  @ApiQuery({
    name: 'soloAfiliados',
    required: false,
    description: 'Por defecto true. Enviar false para incluir no afiliados.',
  })
  @ApiOkResponseData(ParticipantResponseDto, true)
  @ApiErrorResponsesConfig([500])
  findAll(
    @Query('sexo') sexo?: string,
    @Query('query') query?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit = 50,
    @Query('soloAfiliados', new DefaultValuePipe(true), ParseBoolPipe)
    soloAfiliados = true,
  ) {
    return this.deportistasService.searchParticipants({
      sexo: sexo?.trim() || undefined,
      query: query?.trim() || undefined,
      page,
      limit,
      onlyAffiliated: soloAfiliados,
    });
  }

  @Get('buscar/cedula')
  @SuccessMessage('Deportista encontrado')
  @ApiOperation({ summary: 'Buscar deportista por cédula' })
  @ApiQuery({ name: 'cedula', description: 'Cédula del deportista' })
  @ApiOkResponseData(ParticipantResponseDto)
  @ApiErrorResponsesConfig([400, 404, 500])
  findByCedula(@Query('cedula') cedula: string) {
    return this.deportistasService.findByCedula(cedula);
  }

  @Get(':id')
  @SuccessMessage('Deportista obtenido exitosamente')
  @ApiOperation({ summary: 'Obtener deportista por ID' })
  @ApiParam({ name: 'id', description: 'ID del deportista' })
  @ApiOkResponseData(DeportistaResponseDto)
  @ApiErrorResponsesConfig([400, 404, 500])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deportistasService.findOne(id);
  }

  @Post()
  @SuccessMessage('Deportista creado exitosamente')
  @ApiOperation({ summary: 'Crear deportista' })
  @ApiOkResponseData(DeportistaResponseDto)
  @ApiErrorResponsesConfig([400, 500])
  create(@Body() dto: CreateDeportistaDto) {
    return this.deportistasService.create(dto);
  }

  @Patch(':id')
  @SuccessMessage('Deportista actualizado exitosamente')
  @ApiOperation({ summary: 'Actualizar deportista' })
  @ApiParam({ name: 'id', description: 'ID del deportista' })
  @ApiOkResponseData(DeportistaResponseDto)
  @ApiErrorResponsesConfig([400, 404, 500])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeportistaDto,
  ) {
    return this.deportistasService.update(id, dto);
  }

  @Delete(':id')
  @SuccessMessage('Deportista marcado como eliminado')
  @ApiOperation({ summary: 'Marcar deportista como eliminado (soft delete)' })
  @ApiParam({ name: 'id', description: 'ID del deportista' })
  @ApiOkResponseData(DeletedResourceDto)
  @ApiErrorResponsesConfig([400, 404, 500])
  softDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeletedResourceDto> {
    return this.deportistasService.softDelete(id);
  }

  @Post(':id/restore')
  @SuccessMessage('Deportista restaurado exitosamente')
  @ApiOperation({ summary: 'Restaurar deportista eliminado' })
  @ApiParam({ name: 'id', description: 'ID del deportista' })
  @ApiOkResponseData(DeportistaResponseDto)
  @ApiErrorResponsesConfig([400, 404, 500])
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.deportistasService.restore(id);
  }

  @Delete(':id/permanent')
  @SuccessMessage('Deportista eliminado permanentemente')
  @ApiOperation({ summary: 'Eliminar deportista definitivamente' })
  @ApiParam({ name: 'id', description: 'ID del deportista' })
  @ApiOkResponseData(DeletedResourceDto)
  @ApiErrorResponsesConfig([400, 404, 500])
  hardDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeletedResourceDto> {
    return this.deportistasService.hardDelete(id);
  }

  // @Get('external/:id')
  // @SuccessMessage('Deportista obtenido desde API externa')
  // @ApiOperation({ summary: 'Obtener deportista desde API externa' })
  // @ApiParam({ name: 'id', description: 'ID del deportista en API externa' })
  // @ApiOkResponseData(DeportistaResponseDto)
  // @ApiErrorResponsesConfig([400, 404, 500])
  // getDeportistaFromExternal(@Param('id', ParseIntPipe) id: number) {
  //   return this.deportistasService.getDeportistaFromExternalApi(id);
  // }
}
