import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateDeportistaDto } from './dto/create-deportista.dto';
import { UpdateDeportistaDto } from './dto/update-deportista.dto';
import { ValidationService } from 'src/common/services/validation/validation.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseDeportistaDto } from './dto/base-deportista.dto';
import { ResponseDeportistaDto } from './dto/response-deportista.dto';
import { DeletedResourceDto } from 'src/common/dtos/deleted-resource.dto';
import { Deportista } from '@prisma/client';

@Injectable()
export class DeportistasService {
  constructor(
    private readonly prisma: PrismaService, // Cambia esto por el tipo correcto de PrismaService
    private readonly validationService: ValidationService, // Cambia esto por el tipo correcto de ValidationService
  ) {}

  async create(
    createDeportistaDto: CreateDeportistaDto,
  ): Promise<ResponseDeportistaDto> {
    await this.validateDeportistaData(createDeportistaDto);

    return this.prisma.$transaction(async (tx) => {
      console.log('Iniciando transacción para crear deportista...');
      const deportista = await tx.deportista.create({
        data: {
          ...createDeportistaDto,
        },
      });
      console.log('Deportista creado:', deportista);
      return { ...deportista } as ResponseDeportistaDto;
    });
  }

  findAll(): Promise<ResponseDeportistaDto[]> {
    return this.prisma.deportista.findMany({
      where: { deleted: false },
    });
  }

  /** Devuelve todos los deportistas que fueron deshabilitados (deleted = true) */
  findDeleted(): Promise<ResponseDeportistaDto[]> {
    return this.prisma.deportista
      .findMany({
        where: { deleted: true },
      })
      .then((items) => items as ResponseDeportistaDto[]);
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ items: ResponseDeportistaDto[]; pagination: any }> {
    // Simple pagination helper inline to avoid new dependency: calculate skip/take
    const p = Math.max(1, page || 1);
    const l = Math.max(1, limit || 10);
    const skip = (p - 1) * l;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.deportista.count({ where: { deleted: false } }),
      this.prisma.deportista.findMany({
        skip,
        take: l,
        where: { deleted: false },
      }),
    ]);

    const lastPage = Math.max(1, Math.ceil(total / l));

    return {
      items,
      pagination: {
        total,
        page: p,
        limit: l,
        lastPage,
        hasNext: p < lastPage,
        hasPrev: p > 1,
      },
    };
  }

  findOne(id: number): Promise<ResponseDeportistaDto> {
    return this.prisma.deportista.findUniqueOrThrow({
      where: { id, deleted: false },
    });
  }

  async update(id: number, updateDeportistaDto: UpdateDeportistaDto) {
    await this.validateDeportistaData(updateDeportistaDto);

    return this.prisma.deportista.update({
      where: { id, deleted: false },
      data: {
        ...updateDeportistaDto,
      },
    });
  }

  async softDelete(id: number): Promise<DeletedResourceDto> {
    const d = await this.prisma.deportista.findFirst({
      where: { id, deleted: false },
    });
    if (!d) {
      throw new NotFoundException(
        `Deportista con ID ${id} no encontrado o ya eliminado`,
      );
    }

    await this.prisma.deportista.update({
      where: { id },
      data: { deleted: true, updatedAt: new Date() },
    });

    return { id };
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.deportista.delete({ where: { id } });
    } catch (e: any) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`Deportista ${id} no encontrado`);
      }
      if (e.code === 'P2003') {
        throw new ConflictException(
          'No se puede eliminar: dependencias existentes',
        );
      }
      throw e;
    }
  }

  async restore(id: number): Promise<ResponseDeportistaDto> {
    const d = await this.prisma.deportista.findUnique({
      where: { id, deleted: true },
    });
    if (!d) {
      throw new NotFoundException('Deportista no encontrado o habilitado');
    }

    await this.prisma.deportista.update({
      where: { id },
      data: { deleted: false, updatedAt: new Date() },
    });

    return this.findOne(id);
  }

  async validateDeportistaData(
    data: CreateDeportistaDto | UpdateDeportistaDto,
  ) {
    if (data.cedula) {
      await this.validationService.validateUniqueCedulaDeportista(data.cedula);
    }
    console.log('Validación de cédula exitosa:', data.cedula);

    // Validar categoría y disciplina si se proveen
    if (data.categoriaId) {
      await this.validationService.validateCategoria(data.categoriaId);
    }
    console.log('Validación de categoría exitosa:', data.categoriaId);

    if (data.disciplinaId) {
      await this.validationService.validateDisciplina(data.disciplinaId);
    }
  }

  // async afiliarUser(
  //   id: number,
  //   updateUserDto: UpdateUserDto,
  // ): Promise<boolean> {
  //   const user = await this.prisma.usuario.findUnique({
  //     where: { id },
  //     select: { id: true, deleted: true },
  //   });

  //   if (!user || user.deleted) {
  //     throw new NotFoundException('Usuario no encontrado o deshabilitado');
  //   }

  //   await this.validateUserData(updateUserDto, true, id);

  //   const { categoria_id, disciplina_id, rol_ids } = updateUserDto;

  //   await this.prisma.$transaction(async (tx) => {
  //     await tx.usuario.update({
  //       where: { id },
  //       data: {
  //         updated_at: new Date(),
  //         categoria_id,
  //         disciplina_id,
  //         afiliacion: true,
  //         UsuariosRol: rol_ids
  //           ? {
  //               deleteMany: {},
  //               create: rol_ids.map((rol_id) => ({
  //                 rol_id,
  //                 created_at: new Date(),
  //                 updated_at: new Date(),
  //               })),
  //             }
  //           : undefined,
  //       },
  //     });
  //   });

  //   return true;
  // }
}
