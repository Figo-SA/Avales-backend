import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DeportistasService } from './deportistas.service';
import { ParticipantResponseDto } from './dto/participant-response.dto';
import { ApiOkResponseData } from 'src/common/swagger/decorators/api-success-responses.decorator';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import { DeportistaResponseDto } from './dto/deportista-response.dto';

@ApiTags('Deportistas')
@Controller('deportistas')
export class DeportistasController {
  constructor(private readonly deportistasService: DeportistasService) {}
  @Get()
  @SuccessMessage('Deportistas obtenidos exitosamente')
  @ApiOperation({ summary: 'Listar deportistas (filtrable y paginado)' })
  @ApiOkResponseData(ParticipantResponseDto, true)
  @ApiErrorResponsesConfig([500])
  findAll(
    @Query('sexo') sexo?: string,
    @Query('query') query?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    const pageNum = parseInt(page as any, 10) || 1;
    const limitNum = parseInt(limit as any, 10) || 50;

    return this.deportistasService.searchParticipants({
      sexo,
      query,
      page: pageNum,
      limit: limitNum,
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

  // ---------------------- ENTRENADORES (local + externa) ----------------------
  @Get('entrenadores')
  @SuccessMessage('Entrenadores obtenidos')
  @ApiOperation({ summary: 'Listar entrenadores registrados (BD local)' })
  @ApiOkResponseData(ParticipantResponseDto, true)
  @ApiErrorResponsesConfig([500])
  findAllEntrenadores() {
    return this.deportistasService.findAllEntrenadores();
  }

  @Get('entrenadores/buscar/cedula')
  @SuccessMessage('Entrenador encontrado')
  @ApiOperation({ summary: 'Buscar entrenador por cédula (BD local)' })
  @ApiQuery({ name: 'cedula', description: 'Cédula del entrenador' })
  @ApiOkResponseData(ParticipantResponseDto)
  @ApiErrorResponsesConfig([400, 404, 500])
  findEntrenadorByCedula(@Query('cedula') cedula: string) {
    return this.deportistasService.findEntrenadorByCedula(cedula);
  }

  @Get('entrenadores/:id')
  @SuccessMessage('Entrenador obtenido')
  @ApiOperation({ summary: 'Obtener entrenador por ID (BD local)' })
  @ApiParam({ name: 'id', description: 'ID del entrenador' })
  @ApiOkResponseData(ParticipantResponseDto)
  @ApiErrorResponsesConfig([400, 404, 500])
  findEntrenador(@Param('id', ParseIntPipe) id: number) {
    return this.deportistasService.findEntrenador(id);
  }

  @Get('entrenadores/external/:id')
  @SuccessMessage('Entrenador obtenido desde API externa')
  @ApiOperation({ summary: 'Obtener entrenador desde API externa' })
  @ApiParam({ name: 'id', description: 'ID del entrenador en API externa' })
  @ApiOkResponseData(ParticipantResponseDto)
  @ApiErrorResponsesConfig([400, 404, 500])
  getEntrenadorFromExternal(@Param('id', ParseIntPipe) id: number) {
    return this.deportistasService.getEntrenadorFromExternalApi(id);
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

  @Get('external/:id')
  @SuccessMessage('Deportista obtenido desde API externa')
  @ApiOperation({ summary: 'Obtener deportista desde API externa' })
  @ApiParam({ name: 'id', description: 'ID del deportista en API externa' })
  @ApiOkResponseData(DeportistaResponseDto)
  @ApiErrorResponsesConfig([400, 404, 500])
  getDeportistaFromExternal(@Param('id', ParseIntPipe) id: number) {
    return this.deportistasService.getDeportistaFromExternalApi(id);
  }
}
