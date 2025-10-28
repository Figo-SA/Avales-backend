import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationHelper } from 'src/common/herlpers/pagination.helper';
import { PaginationMetaDto } from 'src/common/dtos/pagination-meta.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { Estado } from '@prisma/client';
import { StorageService } from 'src/common/services/storage/storage.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
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
          fechaInicio: 'desc',
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
}
