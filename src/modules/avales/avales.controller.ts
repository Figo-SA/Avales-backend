import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Body,
  Res,
  ParseIntPipe,
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
import { AvalesService } from './avales.service';
import { CreateAvalDto } from './dto/create-aval.dto';
import { UploadConvocatoriaDto } from './dto/upload-convocatoria.dto';
import { AvalQueryDto } from './dto/aval-query.dto';
import { ApproveRejectAvalDto } from './dto/approve-reject-aval.dto';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import {
  ApiGetAvales,
  ApiGetAval,
  ApiCreateAval,
  ApiUploadConvocatoria,
  ApiUploadAvalArchivo,
  ApiDownloadDtmPdf,
  ApiDownloadPdaPdf,
  ApiAprobarAval,
  ApiRechazarAval,
  ApiGetAvalHistorial,
  ApiGetAvalesByEvento,
} from './decorators/api-avales-responses.decorator';

@ApiTags('avales')
@Controller('avales')
export class AvalesController {
  constructor(private readonly avalesService: AvalesService) {}

  @Get()
  @ApiAuth(
    ValidRoles.entrenador,
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
    ValidRoles.pda,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  @ApiGetAvales()
  findAll(@Query() query: AvalQueryDto) {
    return this.avalesService.findAll(query);
  }

  @Get(':id')
  @ApiAuth(
    ValidRoles.entrenador,
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
    ValidRoles.pda,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  @ApiGetAval()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.avalesService.findOne(id);
  }

  @Get('evento/:eventoId')
  @ApiAuth(
    ValidRoles.entrenador,
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
    ValidRoles.pda,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  @ApiGetAvalesByEvento()
  findByEvento(@Param('eventoId', ParseIntPipe) eventoId: number) {
    return this.avalesService.findByEvento(eventoId);
  }

  @Get(':id/historial')
  @ApiAuth(
    ValidRoles.entrenador,
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
    ValidRoles.pda,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  @ApiGetAvalHistorial()
  findHistorial(@Param('id', ParseIntPipe) id: number) {
    return this.avalesService.findHistorial(id);
  }

  @Post('convocatoria')
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiUploadConvocatoria()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('convocatoria'))
  @SuccessMessage('Convocatoria subida y colección de aval creada exitosamente')
  uploadConvocatoria(
    @Body() uploadConvocatoriaDto: UploadConvocatoriaDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
        fileIsRequired: true,
      }),
    )
    convocatoria: Express.Multer.File,
  ) {
    return this.avalesService.uploadConvocatoria(
      uploadConvocatoriaDto.eventoId,
      convocatoria,
    );
  }

  @Post()
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiCreateAval()
  @SuccessMessage('Solicitud de aval creada exitosamente')
  create(@Body() createAvalDto: CreateAvalDto) {
    return this.avalesService.create(createAvalDto);
  }

  @Patch(':id/archivo')
  @ApiAuth(ValidRoles.entrenador, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiUploadAvalArchivo()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('archivo'))
  @SuccessMessage('Archivo del aval subido correctamente')
  uploadArchivo(
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
    return this.avalesService.uploadArchivo(id, archivo);
  }

  @Get(':id/dtm-pdf')
  @ApiAuth(
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  @ApiDownloadDtmPdf()
  async downloadDtmPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { buffer: pdfBuffer } = await this.avalesService.generateDtmPdf(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=aval-dtm-${id}.pdf`,
    );
    res.send(pdfBuffer);
  }

  @Get(':id/pda-pdf')
  @ApiAuth(ValidRoles.pda, ValidRoles.admin, ValidRoles.superAdmin)
  @ApiDownloadPdaPdf()
  async downloadPdaPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { buffer: pdfBuffer } = await this.avalesService.generatePdaPdf(id);

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
  @ApiAprobarAval()
  @SuccessMessage('Aval aprobado exitosamente')
  aprobar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApproveRejectAvalDto,
  ) {
    return this.avalesService.aprobar(id, body.usuarioId);
  }

  @Patch(':id/rechazar')
  @ApiAuth(
    ValidRoles.dtm,
    ValidRoles.dtm_eide,
    ValidRoles.admin,
    ValidRoles.superAdmin,
  )
  @ApiRechazarAval()
  @SuccessMessage('Aval rechazado')
  rechazar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApproveRejectAvalDto,
  ) {
    return this.avalesService.rechazar(id, body.usuarioId, body.motivo);
  }
}
