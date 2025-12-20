import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
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
  @ApiOkResponseData(ParticipantResponseDto, true)
  @ApiErrorResponsesConfig([500])
  findAll(
    @Query('sexo') sexo?: string,
    @Query('query') query?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit = 50,
  ) {
    return this.deportistasService.searchParticipants({
      sexo: sexo?.trim() || undefined,
      query: query?.trim() || undefined,
      page,
      limit,
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
