import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { AthleteQueryDto } from './dto/athlete-query.dto';
import { DeletedResourceDto } from 'src/common/dtos/deleted-resource.dto';
import {
  AthleteNotFoundException,
  AthleteAlreadyDeletedException,
  AthleteNotDeletedException,
} from './exceptions/athletes.exceptions';

@Injectable()
export class AthletesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mapea un deportista de Prisma al DTO de respuesta
   * Los campos se devuelven en español para el frontend
   */
  private mapToResponse(athlete: any) {
    return {
      id: athlete.id,
      nombres: athlete.nombres,
      apellidos: athlete.apellidos,
      cedula: athlete.cedula,
      genero: athlete.genero,
      fechaNacimiento: athlete.fechaNacimiento?.toISOString(),
      disciplina: athlete.disciplina
        ? {
            id: athlete.disciplina.id,
            nombre: athlete.disciplina.nombre,
          }
        : undefined,
      categoria: athlete.categoria
        ? {
            id: athlete.categoria.id,
            nombre: athlete.categoria.nombre,
          }
        : undefined,
      afiliacion: athlete.afiliacion,
      afiliacionInicio: athlete.afiliacionInicio?.toISOString(),
      afiliacionFin: athlete.afiliacionFin?.toISOString(),
      createdAt: athlete.createdAt?.toISOString(),
      updatedAt: athlete.updatedAt?.toISOString(),
    };
  }

  /**
   * Listar atletas con filtros y paginación
   */
  async findAll(query: AthleteQueryDto) {
    const { page, limit, genero, query: searchQuery, soloAfiliados } = query;
    const skip = (page - 1) * limit;
    const now = new Date();

    const filters: any[] = [{ deleted: false }];

    if (soloAfiliados) {
      filters.push({ afiliacion: true });
      filters.push({
        OR: [{ afiliacionFin: null }, { afiliacionFin: { gte: now } }],
      });
    }

    if (genero) {
      filters.push({ genero: { equals: genero } });
    }

    if (searchQuery) {
      filters.push({
        OR: [
          { nombres: { contains: searchQuery, mode: 'insensitive' } },
          { apellidos: { contains: searchQuery, mode: 'insensitive' } },
          { cedula: { contains: searchQuery, mode: 'insensitive' } },
        ],
      });
    }

    const where = filters.length > 1 ? { AND: filters } : filters[0];

    const [total, athletes] = await this.prisma.$transaction([
      this.prisma.deportista.count({ where }),
      this.prisma.deportista.findMany({
        where,
        include: { categoria: true, disciplina: true },
        orderBy: { apellidos: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    const items = athletes.map((a) => this.mapToResponse(a));

    return {
      items,
      pagination: { page, limit, total },
    };
  }

  /**
   * Obtener un atleta por ID
   */
  async findOne(id: number) {
    const athlete = await this.prisma.deportista.findFirst({
      where: { id, deleted: false },
      include: { categoria: true, disciplina: true },
    });

    if (!athlete) {
      throw new AthleteNotFoundException();
    }

    return this.mapToResponse(athlete);
  }

  /**
   * Buscar atleta por cédula
   */
  async findByCedula(cedula: string) {
    const athlete = await this.prisma.deportista.findFirst({
      where: { cedula, deleted: false },
      include: { categoria: true, disciplina: true },
    });

    if (!athlete) {
      throw new AthleteNotFoundException();
    }

    return this.mapToResponse(athlete);
  }

  /**
   * Crear un nuevo atleta
   */
  async create(dto: CreateAthleteDto) {
    const {
      afiliacion,
      afiliacionInicio,
      fechaNacimiento,
      nombres,
      apellidos,
      genero,
      categoriaId,
      disciplinaId,
      cedula,
    } = dto;

    let affiliationStart: Date | null = afiliacionInicio
      ? new Date(afiliacionInicio)
      : null;

    let affiliationEnd: Date | null = null;

    if (afiliacion) {
      if (!affiliationStart) {
        affiliationStart = new Date();
      }
      const end = new Date(affiliationStart);
      end.setFullYear(end.getFullYear() + 1);
      affiliationEnd = end;
    }

    const athlete = await this.prisma.deportista.create({
      data: {
        nombres,
        apellidos,
        cedula,
        fechaNacimiento: new Date(fechaNacimiento),
        genero,
        categoriaId,
        disciplinaId,
        afiliacion,
        afiliacionInicio: affiliationStart,
        afiliacionFin: affiliationEnd,
        deleted: false,
      },
      include: { categoria: true, disciplina: true },
    });

    return this.mapToResponse(athlete);
  }

  /**
   * Actualizar un atleta
   */
  async update(id: number, dto: UpdateAthleteDto) {
    const current = await this.prisma.deportista.findFirst({
      where: { id, deleted: false },
    });

    if (!current) {
      throw new AthleteNotFoundException();
    }

    const data: any = {};

    // Mapear campos del DTO al modelo de Prisma
    if (dto.nombres !== undefined) data.nombres = dto.nombres;
    if (dto.apellidos !== undefined) data.apellidos = dto.apellidos;
    if (dto.cedula !== undefined) data.cedula = dto.cedula;
    if (dto.fechaNacimiento !== undefined) data.fechaNacimiento = new Date(dto.fechaNacimiento);
    if (dto.genero !== undefined) data.genero = dto.genero;
    if (dto.categoriaId !== undefined) data.categoriaId = dto.categoriaId;
    if (dto.disciplinaId !== undefined) data.disciplinaId = dto.disciplinaId;

    // Lógica de afiliación
    if (typeof dto.afiliacion === 'boolean') {
      const newAffiliation = dto.afiliacion;
      const currentAffiliation = current.afiliacion;

      if (newAffiliation !== currentAffiliation) {
        const now = new Date();

        if (newAffiliation) {
          const end = new Date(now);
          end.setFullYear(end.getFullYear() + 1);

          data.afiliacion = true;
          data.afiliacionInicio = now;
          data.afiliacionFin = end;
        } else {
          data.afiliacion = false;
          data.afiliacionFin = now;
        }
      }
    }

    const athlete = await this.prisma.deportista.update({
      where: { id },
      data,
      include: { categoria: true, disciplina: true },
    });

    return this.mapToResponse(athlete);
  }

  /**
   * Soft delete - marcar como eliminado
   */
  async softDelete(id: number): Promise<DeletedResourceDto> {
    const athlete = await this.prisma.deportista.findFirst({
      where: { id, deleted: false },
      select: { id: true },
    });

    if (!athlete) {
      throw new AthleteNotFoundException();
    }

    await this.prisma.deportista.update({
      where: { id },
      data: { deleted: true, updatedAt: new Date() },
    });

    return { id };
  }

  /**
   * Restaurar un atleta eliminado
   */
  async restore(id: number) {
    const deleted = await this.prisma.deportista.findFirst({
      where: { id, deleted: true },
    });

    if (!deleted) {
      throw new AthleteNotDeletedException();
    }

    const restored = await this.prisma.deportista.update({
      where: { id },
      data: { deleted: false, updatedAt: new Date() },
      include: { categoria: true, disciplina: true },
    });

    return this.mapToResponse(restored);
  }

  /**
   * Hard delete - eliminar permanentemente
   */
  async hardDelete(id: number): Promise<DeletedResourceDto> {
    const athlete = await this.prisma.deportista.findFirst({
      where: { id, deleted: true },
      select: { id: true },
    });

    if (!athlete) {
      throw new AthleteNotDeletedException();
    }

    await this.prisma.deportista.delete({
      where: { id },
    });

    return { id };
  }
}
