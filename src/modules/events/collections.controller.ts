import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { EventsService } from './events.service';

@ApiTags('collections')
@Controller('events')
export class CollectionsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get(':id/collection')
  @ApiAuth(
    ValidRoles.entrenador,
    ValidRoles.dtm,
    ValidRoles.pda,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  getColeccion(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.getColeccionByEventoId(id);
  }

  @Get('collections')
  @ApiAuth(
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
    ValidRoles.pda,
    ValidRoles.entrenador,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  findColecciones(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('estado') estado?: string,
    @Query('search') search?: string,
  ) {
    const p = parseInt(page as any, 10) || 1;
    const l = parseInt(limit as any, 10) || 10;
    return this.eventsService.findColeccionesPaginated(
      p,
      l,
      estado as any,
      search,
    );
  }
}
