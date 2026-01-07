import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Patch,
  Delete,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventFiltersDto } from './dto/event-filters.dto';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import {
  ApiCreateEvent,
  ApiGetEventsPaginated,
  ApiGetEvent,
  ApiUpdateEvent,
  ApiDeleteEvent,
  ApiRestoreEvent,
} from './decorators';
import { UpdateEventDto } from './dto/update-event.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UsuarioConRoles } from '../auth/interfaces/usuario-roles';
import { log } from 'console';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiCreateEvent()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('archivo'))
  create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    archivo?: Express.Multer.File,
  ) {
    return this.eventsService.create(createEventDto, archivo);
  }

  @Get()
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiGetEventsPaginated()
  findAll(@Query() filters: EventFiltersDto, @GetUser() user: UsuarioConRoles) {
    const { page = 1, limit = 10, estado, search, sinAval } = filters;

    // Si el usuario es entrenador, filtrar solo eventos de su disciplina
    const isEntrenador = user.usuariosRol.some(
      (ur) => ur.rol.nombre === ValidRoles.entrenador,
    );
    const disciplinaId = isEntrenador ? user.disciplinaId : undefined;

    return this.eventsService.findAllPaginated(
      page,
      limit,
      estado,
      search,
      disciplinaId,
      sinAval,
    );
  }

  @Patch(':id')
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiUpdateEvent()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiDeleteEvent()
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.softDeleteEvent(id);
  }

  @Patch(':id/restore')
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiRestoreEvent()
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.restoreEvent(id);
  }

  @Get(':id')
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiGetEvent()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }
}
