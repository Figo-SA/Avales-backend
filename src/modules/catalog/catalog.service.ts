import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CatalogItemDto } from './dto/catalog-item.dto';
import { CatalogResponseDto } from './dto/catalog-response.dto';
import { ItemResponseDto } from './dto/item-response.dto';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtener todas las categorías
   */
  async getCategorias(): Promise<CatalogItemDto[]> {
    return this.prisma.categoria.findMany({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  }

  /**
   * Obtener todas las disciplinas
   */
  async getDisciplinas(): Promise<CatalogItemDto[]> {
    return this.prisma.disciplina.findMany({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  }

  /**
   * Obtener el catálogo completo (categorías + disciplinas)
   */
  async getCatalog(): Promise<CatalogResponseDto> {
    const [categorias, disciplinas] = await Promise.all([
      this.getCategorias(),
      this.getDisciplinas(),
    ]);

    return { categorias, disciplinas };
  }

  /**
   * Obtener todas las actividades presupuestarias
   */
  async getActividades(): Promise<CatalogItemDto[]> {
    return this.prisma.actividad.findMany({
      select: { id: true, nombre: true },
      orderBy: { numero: 'asc' },
    });
  }

  /**
   * Obtener todos los items presupuestarios
   * @param actividadId Filtrar por actividad (opcional)
   */
  async getItems(actividadId?: number): Promise<ItemResponseDto[]> {
    const where = actividadId ? { actividadId } : {};

    const items = await this.prisma.item.findMany({
      where,
      include: {
        actividad: {
          select: { id: true, nombre: true, numero: true },
        },
      },
      orderBy: [{ actividad: { numero: 'asc' } }, { numero: 'asc' }],
    });

    return items.map((item) => this.mapItemToResponse(item));
  }

  /**
   * Obtener un item presupuestario por ID
   */
  async getItemById(id: number): Promise<ItemResponseDto> {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        actividad: {
          select: { id: true, nombre: true, numero: true },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Item con ID ${id} no encontrado`);
    }

    return this.mapItemToResponse(item);
  }

  /**
   * Mapea un item de Prisma a ItemResponseDto
   */
  private mapItemToResponse(item: {
    id: number;
    nombre: string;
    numero: number;
    descripcion: string;
    createdAt: Date;
    updatedAt: Date;
    actividad: { id: number; nombre: string; numero: number };
  }): ItemResponseDto {
    return {
      id: item.id,
      nombre: item.nombre,
      numero: item.numero,
      descripcion: item.descripcion,
      actividad: item.actividad
        ? {
            id: item.actividad.id,
            nombre: item.actividad.nombre,
            numero: item.actividad.numero,
          }
        : undefined,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}