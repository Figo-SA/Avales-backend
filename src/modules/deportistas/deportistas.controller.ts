import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { DeportistasService } from './deportistas.service';
import { ApiOkResponseData } from 'src/common/swagger/decorators/api-success-responses.decorator';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import { DeportistaResponseDto } from './dto/deportista-response.dto';

@Controller('deportistas')
export class DeportistasController {
  constructor(private readonly deportistasService: DeportistasService) {}

  @Get(':id')
  @SuccessMessage('Deportista obtenido exitosamente')
  @ApiOperation({ summary: 'Obtiene un deportista desde API externa' })
  @ApiParam({ name: 'id', description: 'ID del deportista' })
  @ApiOkResponseData(DeportistaResponseDto)
  @ApiErrorResponsesConfig([400, 404, 500])
  getDeportista(@Param('id', ParseIntPipe) id: number) {
    return this.deportistasService.getDeportistaFromExternalApi(id);
  }
}
