import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDeportistaDto } from './dto/create-deportista.dto';
import { UpdateDeportistaDto } from './dto/update-deportista.dto';
import { DeletedResourceDto } from 'src/common/dtos/deleted-resource.dto';

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
      genero: String(d.genero).toLowerCase(),
      fechaNacimiento: d.fechaNacimiento
        ? d.fechaNacimiento.toISOString()
        : undefined,
      club: d.club ?? undefined,
      disciplina: d.disciplina
        ? {
            id: d.disciplina.id,
            nombre: d.disciplina.nombre,
          }
        : undefined,
      categoria: d.categoria
        ? {
            id: d.categoria.id,
            nombre: d.categoria.nombre,
          }
        : undefined,
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
    onlyAffiliated?: boolean;
  }) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 50;
    const skip = (page - 1) * limit;
    const onlyAffiliated =
      typeof options.onlyAffiliated === 'boolean'
        ? options.onlyAffiliated
        : true;

    const now = new Date();

    const filters: any[] = [{ deleted: false }];

    if (onlyAffiliated) {
      filters.push({
        afiliacion: true,
      });

      // si manejas expiración:
      filters.push({
        OR: [{ afiliacionFin: null }, { afiliacionFin: { gte: now } }],
      });
    }

    if (options.sexo) {
      filters.push({
        genero: { equals: options.sexo.toUpperCase() } as any,
      });
    }

    if (options.query) {
      filters.push({
        OR: [
          { nombres: { contains: options.query, mode: 'insensitive' } },
          { apellidos: { contains: options.query, mode: 'insensitive' } },
          { cedula: { contains: options.query, mode: 'insensitive' } },
        ],
      });
    }

    const where =
      filters.length > 1 ? { AND: filters } : (filters[0] as Record<string, any>);

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
    const {
      afiliacion,
      afiliacionInicio: afiliacionInicioInput,
      fechaNacimiento,
      ...rest
    } = createDeportistaDto;

    let afiliacionInicio: Date | null | undefined = afiliacionInicioInput
      ? new Date(afiliacionInicioInput)
      : undefined;

    let afiliacionFin: Date | null | undefined;

    if (afiliacion) {
      // siempre ignoramos la fecha fin entrante y calculamos 1 año despues
      if (!afiliacionInicio) {
        afiliacionInicio = new Date();
      }
      const fin = new Date(afiliacionInicio);
      fin.setFullYear(fin.getFullYear() + 1);
      afiliacionFin = fin;
    } else {
      afiliacionInicio = null;
      afiliacionFin = null;
    }

    return this.prisma.deportista.create({
      data: {
        ...rest,
        fechaNacimiento: new Date(fechaNacimiento),
        afiliacion,
        afiliacionInicio,
        afiliacionFin,
        deleted: false,
      },
    });
  }

  async update(id: number, updateDeportistaDto: UpdateDeportistaDto) {
    // 1) Obtener el deportista actual
    const current = await this.prisma.deportista.findUnique({
      where: { id },
    });

    if (!current) {
      throw new HttpException('Deportista no encontrado', HttpStatus.NOT_FOUND);
    }

    // 2) Preparar el objeto data a partir del DTO
    const data: any = { ...updateDeportistaDto };

    // Si viene fechaNacimiento en el DTO, convertirla a Date
    if (updateDeportistaDto.fechaNacimiento) {
      data.fechaNacimiento = new Date(updateDeportistaDto.fechaNacimiento);
    }

    // 3) Lógica de afiliación
    if (typeof updateDeportistaDto.afiliacion === 'boolean') {
      const nuevaAfiliacion = updateDeportistaDto.afiliacion;
      const afiliacionActual = current.afiliacion;

      // Solo si cambia el estado, ajustamos fechas
      if (nuevaAfiliacion !== afiliacionActual) {
        const now = new Date();

        if (nuevaAfiliacion) {
          // Se afilia (o se reactiva): inicio ahora, fin en 1 año
          const fin = new Date(now);
          fin.setFullYear(fin.getFullYear() + 1);

          data.afiliacion = true;
          data.afiliacionInicio = now;
          data.afiliacionFin = fin;
        } else {
          // Se desafilía: marcamos fin ahora
          data.afiliacion = false;
          data.afiliacionFin = now;
          // opcional: podrías dejar afiliacionInicio como está (histórico)
        }
      }
      // Si el valor es el mismo, no tocamos fechas
    }

    // 4) Ejecutar update
    const deportista = await this.prisma.deportista.update({
      where: { id },
      data,
      include: {
        categoria: true,
        disciplina: true,
      },
    });

    return deportista; // o tu mapper si usas uno
  }

  async softDelete(id: number): Promise<DeletedResourceDto> {
    const deportista = await this.prisma.deportista.findFirst({
      where: { id, deleted: false },
      select: { id: true },
    });

    if (!deportista) {
      throw new HttpException(
        'Deportista no encontrado o ya eliminado',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.deportista.update({
      where: { id },
      data: { deleted: true, updatedAt: new Date() },
    });

    return { id };
  }

  async restore(id: number) {
    const deleted = await this.prisma.deportista.findFirst({
      where: { id, deleted: true },
    });

    if (!deleted) {
      throw new HttpException(
        'Deportista no encontrado o no está eliminado',
        HttpStatus.NOT_FOUND,
      );
    }

    const restored = await this.prisma.deportista.update({
      where: { id },
      data: { deleted: false, updatedAt: new Date() },
      include: {
        categoria: true,
        disciplina: true,
      },
    });

    return this.mapDeportistaToParticipant(restored);
  }

  async hardDelete(id: number): Promise<DeletedResourceDto> {
    const deportista = await this.prisma.deportista.findFirst({
      where: { id, deleted: true },
      select: { id: true },
    });

    if (!deportista) {
      throw new HttpException(
        'Deportista no encontrado o no marcado como eliminado',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.deportista.delete({
      where: { id },
    });

    return { id };
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
