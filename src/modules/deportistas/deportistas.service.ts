import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeportistaDto } from './dto/create-deportista.dto';

@Injectable()
export class DeportistasService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  private mapDeportistaToParticipant(d: any) {
    return {
      id: d.id,
      nombres: d.nombres,
      apellidos: d.apellidos,
      cedula: d.cedula,
      sexo: String(d.genero).toLowerCase(),
      fechaNacimiento: d.fechaNacimiento
        ? d.fechaNacimiento.toISOString()
        : undefined,
      club: d.club ?? undefined,
      afiliacion: d.afiliacion,
      afiliacionInicio: d.afiliacionInicio?.toISOString(),
      afiliacionFin: d.afiliacionFin?.toISOString(),
      createdAt: d.createdAt?.toISOString(),
      updatedAt: d.updatedAt?.toISOString(),
    };
  }

  /**
   * Buscar deportistas/entrenadores con filtros y paginación.
   * Busca en ambas tablas y combina resultados.
   */
  async searchParticipants(options: {
    sexo?: string;
    query?: string;
    page?: number;
    limit?: number;
  }) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 50;
    const skip = (page - 1) * limit;

    const now = new Date();

    const where: any = {
      deleted: false,
      afiliacion: true,
      // si manejas expiración:
      OR: [{ afiliacionFin: null }, { afiliacionFin: { gte: now } }],
    };

    if (options.sexo) {
      where.genero = { equals: options.sexo.toUpperCase() } as any;
    }

    if (options.query) {
      where.OR = [
        { nombres: { contains: options.query, mode: 'insensitive' } },
        { apellidos: { contains: options.query, mode: 'insensitive' } },
        { cedula: { contains: options.query, mode: 'insensitive' } },
      ];
    }

    const [total, deportistas] = await this.prisma.$transaction([
      this.prisma.deportista.count({ where }),
      this.prisma.deportista.findMany({
        where,
        include: { categoria: true, disciplina: true },
        orderBy: { apellidos: 'asc' },
        skip,
        take: limit,
      }),
    ]);

    const items = deportistas.map((d) => this.mapDeportistaToParticipant(d));

    return {
      items,
      pagination: { page, limit, total },
    };
  }

  /**
   * Listar todos los deportistas de la base de datos local
   * (Útil para desarrollo y testing)
   */
  async findAll() {
    return this.prisma.deportista.findMany({
      where: {
        deleted: false,
        afiliacion: true,
      },
      include: {
        categoria: true,
        disciplina: true,
      },
      orderBy: { apellidos: 'asc' },
    });
  }

  /**
   * Obtener un deportista por ID desde la base de datos local
   */
  async findOne(id: number) {
    const deportista = await this.prisma.deportista.findFirst({
      where: {
        id,
        deleted: false,
        afiliacion: true,
      },
      include: {
        categoria: true,
        disciplina: true,
      },
    });

    if (!deportista) {
      throw new HttpException('Deportista no encontrado', HttpStatus.NOT_FOUND);
    }

    return this.mapDeportistaToParticipant(deportista);
  }

  /**
   * Buscar deportistas por cédula
   */
  async findByCedula(cedula: string) {
    const deportista = await this.prisma.deportista.findFirst({
      where: {
        cedula,
        deleted: false,
        afiliacion: true,
      },
      include: {
        categoria: true,
        disciplina: true,
      },
    });

    if (!deportista) {
      throw new HttpException('Deportista no encontrado', HttpStatus.NOT_FOUND);
    }

    return this.mapDeportistaToParticipant(deportista);
  }

  async create(createDeportistaDto: CreateDeportistaDto) {
    const now = new Date();
    const fin = new Date(now);
    fin.setFullYear(fin.getFullYear() + 1); // afiliación por 1 año

    return this.prisma.deportista.create({
      data: {
        ...createDeportistaDto,
        fechaNacimiento: new Date(createDeportistaDto.fechaNacimiento),

        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,

        deleted: false,
      },
    });
  }

  /**
   * Obtener deportista desde API externa
   * TODO: Configurar URL de la API externa en variables de entorno
   */
  // async getDeportistaFromExternalApi(id: number) {
  //   try {
  //     // Ejemplo: llamar a una API externa
  //     const response = await firstValueFrom(
  //       this.httpService.get(`https://api.ejemplo.com/deportistas/${id}`),
  //     );

  //     return response.data;
  //   } catch (error) {
  //     if (error.response?.status === 404) {
  //       throw new HttpException(
  //         'Deportista no encontrado en la API externa',
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     throw new HttpException(
  //       'Error al consultar API externa',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  /**
   * Obtener entrenador desde API externa
   */
  // async getEntrenadorFromExternalApi(id: number) {
  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService.get(`https://api.ejemplo.com/entrenadores/${id}`),
  //     );

  //     return response.data;
  //   } catch (error) {
  //     if (error.response?.status === 404) {
  //       throw new HttpException(
  //         'Entrenador no encontrado en la API externa',
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     throw new HttpException(
  //       'Error al consultar API externa',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  /**
   * Listar entrenadores registrados en la BD local
   */
  // async findAllEntrenadores() {
  //   const rows = await this.prisma.entrenador.findMany({
  //     where: { deleted: false },
  //     include: { disciplina: true, categoria: true },
  //     orderBy: { apellidos: 'asc' },
  //   });

  //   return rows.map((r) => this.mapEntrenadorToParticipant(r));
  // }

  /**
   * Obtener un entrenador por ID (BD local)
   */
  // async findEntrenador(id: number) {
  //   const entrenador = await this.prisma.entrenador.findUnique({
  //     where: { id },
  //     include: { disciplina: true, categoria: true },
  //   });

  //   if (!entrenador) {
  //     throw new HttpException('Entrenador no encontrado', HttpStatus.NOT_FOUND);
  //   }

  //   return this.mapEntrenadorToParticipant(entrenador);
  // }

  // private mapEntrenadorToParticipant(e: any) {
  //   return {
  //     id: e.id,
  //     nombres: e.nombres,
  //     apellidos: e.apellidos,
  //     cedula: e.cedula,
  //     sexo: String(e.genero).toLowerCase(),
  //     fechaNacimiento: e.fechaNacimiento
  //       ? e.fechaNacimiento.toISOString()
  //       : undefined,
  //     club: e.afiliacion ? 'Afiliado' : undefined,
  //     createdAt: e.createdAt?.toISOString(),
  //     updatedAt: e.updatedAt?.toISOString(),
  //   };
  // }

  /**
   * Buscar entrenador por cédula (BD local)
   */
  // async findEntrenadorByCedula(cedula: string) {
  //   const entrenador = await this.prisma.entrenador.findFirst({
  //     where: { cedula, deleted: false },
  //     include: { disciplina: true, categoria: true },
  //   });

  //   if (!entrenador) {
  //     throw new HttpException('Entrenador no encontrado', HttpStatus.NOT_FOUND);
  //   }

  //   return this.mapEntrenadorToParticipant(entrenador);
  // }
}
