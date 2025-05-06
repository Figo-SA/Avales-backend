import { Injectable } from '@nestjs/common';
import { CreateDeportistaDto } from './dto/create-deportista.dto';
import { UpdateDeportistaDto } from './dto/update-deportista.dto';

@Injectable()
export class DeportistasService {
  create(createDeportistaDto: CreateDeportistaDto) {
    return 'This action adds a new deportista';
  }

  findAll() {
    return `This action returns all deportistas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deportista`;
  }

  update(id: number, updateDeportistaDto: UpdateDeportistaDto) {
    return `This action updates a #${id} deportista`;
  }

  remove(id: number) {
    return `This action removes a #${id} deportista`;
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
