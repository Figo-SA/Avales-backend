import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationHelper } from 'src/common/herlpers/pagination.helper';
import { PaginationMetaDto } from 'src/common/dtos/pagination-meta.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { Estado } from '@prisma/client';
import { StorageService } from 'src/common/services/storage/storage.service';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private pushNotificationsService: PushNotificationsService,
  ) {}

  async create(createEventDto: CreateEventDto, archivo?: Express.Multer.File) {
    let archivoUrl: string | undefined;

    // Si hay un archivo, subirlo a Supabase
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

    // Construir el where dinámicamente
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

    // Enviar notificación a usuarios con rol DTM
    await this.notifyDTMUsers(eventoActualizado.nombre);

    return eventoActualizado;
  }

  /**
   * Envía notificaciones push a todos los usuarios con rol DTM
   */
  private async notifyDTMUsers(eventoNombre: string) {
    try {
      // Buscar usuarios con rol DTM o DTM_EIDE que tengan pushToken
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
      // Log error pero no fallar el upload
      console.error('Error al enviar notificaciones a DTM:', error);
    }
  }
}
