import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CatalogItemDto } from './dto/catalog-item.dto';
import { CatalogResponseDto } from './dto/catalog-response.dto';

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
}