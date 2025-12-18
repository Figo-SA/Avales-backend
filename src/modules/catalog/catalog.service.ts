import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategorias() {
    return this.prisma.categoria.findMany({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async getDisciplinas() {
    return this.prisma.disciplina.findMany({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async getCatalog() {
    const [categorias, disciplinas] = await Promise.all([
      this.getCategorias(),
      this.getDisciplinas(),
    ]);

    return { categorias, disciplinas };
  }
}
