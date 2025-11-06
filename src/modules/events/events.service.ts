import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationHelper } from 'src/common/herlpers/pagination.helper';
import { PaginationMetaDto } from 'src/common/dtos/pagination-meta.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { Estado } from '@prisma/client';
import { StorageService } from 'src/common/services/storage/storage.service';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { PrinterService } from '../reports/printer/printer.service';
import { solicitudAvalReport } from '../reports/reports/solicitud-aval.report';
import { certificacionPdaReport } from '../reports/reports/certificacion-pda.report';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private pushNotificationsService: PushNotificationsService,
    private printerService: PrinterService,
  ) {}

  async create(createEventDto: CreateEventDto, archivo?: Express.Multer.File) {
    let archivoUrl: string | undefined;

    if (archivo) {
      archivoUrl = await this.storageService.uploadFile(archivo, 'eventos');
    }

    const data = {
      ...createEventDto,
      fechaInicio: new Date(createEventDto.fechaInicio),
      fechaFin: new Date(createEventDto.fechaFin),
      archivo: archivoUrl,
    };

    return this.prisma.evento.create({
      data,
      include: {
        disciplina: true,
        categoria: true,
      },
    });
  }

  async findAllPaginated(
    page: number,
    limit: number,
    estado?: Estado,
    search?: string,
  ): Promise<{
    items: EventResponseDto[];
    pagination: PaginationMetaDto;
  }> {
    const { skip, take } = PaginationHelper.buildPagination(page, limit);

    const where: any = { deleted: false };

    if (estado) {
      where.estado = estado;
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { codigo: { contains: search, mode: 'insensitive' } },
        { lugar: { contains: search, mode: 'insensitive' } },
        { ciudad: { contains: search, mode: 'insensitive' } },
        { provincia: { contains: search, mode: 'insensitive' } },
        { tipoEvento: { contains: search, mode: 'insensitive' } },
        { alcance: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, eventos] = await this.prisma.$transaction([
      this.prisma.evento.count({ where }),
      this.prisma.evento.findMany({
        skip,
        take,
        where,
        include: {
          disciplina: true,
          categoria: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
    ]);

    return PaginationHelper.buildPaginatedResponse(eventos, total, page, limit);
  }

  async findAll() {
    return await this.prisma.evento.findMany({
      where: { deleted: false },
      include: {
        disciplina: true,
        categoria: true,
      },
      orderBy: {
        fechaInicio: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.evento.findUnique({
      where: { id, deleted: false },
      include: {
        disciplina: true,
        categoria: true,
      },
    });
  }

  async uploadFile(id: number, archivo: Express.Multer.File) {
    const evento = await this.prisma.evento.findUnique({
      where: { id, deleted: false },
    });

    if (!evento) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }

    const archivoUrl = await this.storageService.replaceFile(
      evento.archivo,
      archivo,
      'eventos',
    );

    const eventoActualizado = await this.prisma.evento.update({
      where: { id },
      data: {
        archivo: archivoUrl,
        estado: 'SOLICITADO',
      },
      include: {
        disciplina: true,
        categoria: true,
      },
    });

    await this.notifyDTMUsers(eventoActualizado.nombre);

    return eventoActualizado;
  }

  private async notifyDTMUsers(eventoNombre: string) {
    try {
      const dtmUsers = await this.prisma.usuario.findMany({
        where: {
          deleted: false,
          pushToken: { not: null },
          usuariosRol: {
            some: {
              rol: {
                nombre: { in: ['DTM', 'DTM_EIDE'] },
              },
            },
          },
        },
        select: {
          pushToken: true,
        },
      });

      const tokens = dtmUsers
        .map((user) => user.pushToken)
        .filter((token): token is string => token !== null);

      if (tokens.length > 0) {
        await this.pushNotificationsService.sendNotification(
          tokens,
          'Nueva Solicitud de Aval',
          `Se ha subido un archivo para el evento "${eventoNombre}". Por favor revisa la solicitud.`,
          {
            type: 'event-file-uploaded',
            eventoNombre,
            requiresReview: true,
          },
        );
      }
    } catch (error) {
      console.error('Error al enviar notificaciones a DTM:', error);
    }
  }

  async generateDtmPdf(id: number): Promise<Buffer> {
    const evento = await this.prisma.evento.findUnique({
      where: { id, deleted: false },
      include: {
        categoria: true,
        disciplina: true,
      },
    });

    if (!evento) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }

    const reportData = {
      codigo: evento.codigo,
      disciplina: evento.disciplina.nombre,
      categoria: evento.categoria.nombre,
      genero: evento.genero,
      nombre: evento.nombre,
      lugar: evento.lugar,
      fechaInicio: evento.fechaInicio,
      fechaFin: evento.fechaFin,
      numAtletasHombres: evento.numAtletasHombres,
      numAtletasMujeres: evento.numAtletasMujeres,
      numEntrenadoresHombres: evento.numEntrenadoresHombres,
      numEntrenadoresMujeres: evento.numEntrenadoresMujeres,
    };

    const docDefinition = solicitudAvalReport(reportData);
    const pdfDoc = this.printerService.createPdf(docDefinition);

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);

      pdfDoc.end();
    });
  }

  async generatePdaPdf(id: number): Promise<Buffer> {
    const evento = await this.prisma.evento.findUnique({
      where: { id, deleted: false },
      include: {
        categoria: true,
        disciplina: true,
      },
    });

    if (!evento) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }

    const reportData = {
      codigo: evento.codigo,
      disciplina: evento.disciplina.nombre,
      categoria: evento.categoria.nombre,
      genero: evento.genero,
      nombre: evento.nombre,
      lugar: evento.lugar,
      ciudad: evento.ciudad,
      provincia: evento.provincia,
      pais: evento.pais,
      fechaInicio: evento.fechaInicio,
      fechaFin: evento.fechaFin,
      numAtletasHombres: evento.numAtletasHombres,
      numAtletasMujeres: evento.numAtletasMujeres,
      numEntrenadoresHombres: evento.numEntrenadoresHombres,
      numEntrenadoresMujeres: evento.numEntrenadoresMujeres,
    };

    const docDefinition = certificacionPdaReport(reportData);
    const pdfDoc = this.printerService.createPdf(docDefinition);

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);

      pdfDoc.end();
    });
  }
}
