import { Injectable } from '@nestjs/common';
import { CreateDeportistaDto } from './dto/create-deportista.dto';
import { UpdateDeportistaDto } from './dto/update-deportista.dto';
import { ValidationService } from 'src/common/services/validation/validation.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseDeportistaDto } from './dto/base-deportista.dto';
import { ResponseDeportistaDto } from './dto/response-deportista.dto';
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

  async softDelete(id: number): Promise<string> {
    await this.prisma.deportista.update({
      where: { id, deleted: false },
      data: { deleted: true },
    });

    return `Deportista con ID ${id} eliminado correctamente`;
  }

  async validateDeportistaData(
    data: CreateDeportistaDto | UpdateDeportistaDto,
  ) {
    if (data.cedula) {
      await this.validationService.validateUniqueCedula(data.cedula);
    }
    console.log('Validación de cédula exitosa:', data.cedula);

    // Validar categoría y disciplina si se proveen
    if (data.categoria_id) {
      await this.validationService.validateCategoria(data.categoria_id);
    }
    console.log('Validación de categoría exitosa:', data.categoria_id);

    if (data.disciplina_id) {
      await this.validationService.validateDisciplina(data.disciplina_id);
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
