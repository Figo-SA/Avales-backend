import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import {
  ApiCreateEvent,
  ApiGetEvents,
  ApiGetEvent,
  ApiGetEventsPaginated,
} from './decorators';
import { EventFiltersDto } from './dto/event-filters.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiCreateEvent()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get('paginated')
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiGetEventsPaginated()
  findAllPaginated(@Query() filters: EventFiltersDto) {
    const { page = 1, limit = 10, estado, search } = filters;
    return this.eventsService.findAllPaginated(page, limit, estado, search);
  }

  @Get()
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiGetEvents()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiGetEvent()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }
}
