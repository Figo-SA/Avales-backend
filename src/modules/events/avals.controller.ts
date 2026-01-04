import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  ParseIntPipe,
  Body,
  Res,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { ApiAuth } from 'src/common/decorators/api-auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { EventsService } from './events.service';
import { CreateSolicitudAvalDto } from './dto/create-solicitud-aval.dto';
import { ApproveRejectDto } from './dto/approve-reject.dto';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import {
  ApiDownloadSolicitudPdf,
  ApiUploadEventFile,
} from './decorators';

@ApiTags('avals')
@Controller('events')
export class AvalesController {
  constructor(private readonly eventsService: EventsService) {}

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
}
