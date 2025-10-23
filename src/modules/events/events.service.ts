import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationHelper } from 'src/common/herlpers/pagination.helper';
import { PaginationMetaDto } from 'src/common/dtos/pagination-meta.dto';
import { EventResponseDto } from './dto/event-response.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    const data = {
      ...createEventDto,
      fechaInicio: new Date(createEventDto.fechaInicio),
      fechaFin: new Date(createEventDto.fechaFin),
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
  ): Promise<{
    items: EventResponseDto[];
    pagination: PaginationMetaDto;
  }> {
    const { skip, take } = PaginationHelper.buildPagination(page, limit);

    const [total, eventos] = await this.prisma.$transaction([
      this.prisma.evento.count({ where: { deleted: false } }),
      this.prisma.evento.findMany({
        skip,
        take,
        where: { deleted: false },
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
