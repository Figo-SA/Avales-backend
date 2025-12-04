import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Patch,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateSolicitudAvalDto } from './dto/create-solicitud-aval.dto';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { ParseJsonPipe } from 'src/common/pipes/parse-json.pipe';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import {
  ApiCreateEvent,
  ApiGetEvents,
  ApiGetEvent,
  ApiGetEventsPaginated,
  ApiUploadEventFile,
  ApiDownloadSolicitudPdf,
} from './decorators';
import { EventFiltersDto } from './dto/event-filters.dto';
import { ApproveRejectDto } from './dto/approve-reject.dto';

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

  @Get(':id/coleccion')
  @ApiAuth(
    ValidRoles.entrenador,
    ValidRoles.dtm,
    ValidRoles.pda,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  async getColeccion(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.getColeccionByEventoId(id);
  }

  @Get('colecciones')
  @ApiAuth(
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
    ValidRoles.pda,
    ValidRoles.entrenador,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  async findColecciones(
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

  @Post(':id/aval')
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  // @ApiCreateAval() // TODO: Crear decorador de Swagger
  @SuccessMessage('Solicitud de aval creada correctamente')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('solicitud'))
  createAval(
    @Param('id', ParseIntPipe) id: number,
    @Body() solicitudData: CreateSolicitudAvalDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    solicitud?: Express.Multer.File,
  ) {
    return this.eventsService.createAval(id, solicitudData, solicitud);
  }

  @Patch(':id/aval/archivo')
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiUploadEventFile()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('archivo'))
  @SuccessMessage('Archivo del aval subido correctamente')
  uploadAvalArchivo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf)$/ }),
        ],
        fileIsRequired: true,
      }),
    )
    archivo: Express.Multer.File,
  ) {
    return this.eventsService.uploadAvalArchivo(id, archivo);
  }

  @Get(':id/dtm-pdf')
  @ApiAuth(
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  @ApiDownloadSolicitudPdf()
  async downloadDtmPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { buffer: pdfBuffer } = await this.eventsService.generateDtmPdf(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=aval-dtm-${id}.pdf`,
    );
    res.send(pdfBuffer);
  }

  @Get(':id/pda-pdf')
  @ApiAuth(ValidRoles.pda, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiDownloadSolicitudPdf()
  async downloadPdaPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { buffer: pdfBuffer } = await this.eventsService.generatePdaPdf(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=certificacion-pda-${id}.pdf`,
    );
    res.send(pdfBuffer);
  }

  @Patch(':id/aprobar')
  @ApiAuth(
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  aprobarSolicitud(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApproveRejectDto,
  ) {
    return this.eventsService.aprobarSolicitud(id, body.usuarioId);
  }

  @Patch(':id/rechazar')
  @ApiAuth(
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  rechazarSolicitud(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApproveRejectDto,
  ) {
    return this.eventsService.rechazarSolicitud(
      id,
      body.usuarioId,
      body.motivo,
    );
  }

  @Get(':id')
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiGetEvent()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }
}
