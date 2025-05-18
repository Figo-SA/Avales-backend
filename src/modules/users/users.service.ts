import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/common/services/password/password.service';
import { ValidationService } from 'src/common/services/validation/validation.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private validationService: ValidationService,
  ) {}

  private async validateUserData(
    data: CreateUserDto | UpdateUserDto,
    isUpdate = false,
    excludeId?: number,
  ): Promise<void> {
    // Validar cédula
    if (!isUpdate || data.cedula) {
      await this.validationService.validateUniqueCedula(
        data.cedula || '',
        excludeId,
      );
    }

    // Validar roles
    if (!isUpdate || data.rolIds) {
      const rolIds = data.rolIds || [];
      if (rolIds.length === 0) {
        throw new BadRequestException('Debe proporcionar al menos un rol');
      }
      await this.validationService.validateRoles(rolIds);
    }

    // Validar email si se provee
    if (data.email) {
      await this.validationService.validateUniqueEmail(data.email, excludeId);
    }

    // Validar categoría y disciplina si se proveen
    if (data.categoriaId) {
      await this.validationService.validateCategoria(data.categoriaId);
    }

    if (data.disciplinaId) {
      await this.validationService.validateDisciplina(data.disciplinaId);
    }
  }

  async create(data: CreateUserDto): Promise<ResponseUserDto> {
    // Validar los datos del usuario
    await this.validateUserData(data);

    // Hash de la contraseña
    const hashedPassword = await this.passwordService.hashPassword(
      data.password,
    );

    // Creación del usuario y asignación de roles en transacción
    return this.prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          email: data.email ?? '',
          password: hashedPassword,
          nombre: data.nombre,
          apellido: data.apellido ?? '',
          cedula: data.cedula,
          categoriaId: data.categoriaId ?? 1,
          disciplinaId: data.disciplinaId ?? 1,
        },
      });

      await tx.usuarioRol.createMany({
        data: data.rolIds.map((rolId) => ({
          usuarioId: usuario.id,
          rolId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      });

      const usuarioConRoles = await tx.usuario.findUnique({
        where: { id: usuario.id },
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
          cedula: true,
          categoriaId: true,
          disciplinaId: true,
          usuariosRol: {
            select: {
              rolId: true,
            },
          },
        },
      });

      if (!usuarioConRoles) {
        throw new NotFoundException(
          'Usuario no encontrado después de la creación',
        );
      }

      return {
        id: usuarioConRoles.id,
        email: usuarioConRoles.email,
        nombre: usuarioConRoles.nombre,
        apellido: usuarioConRoles.apellido,
        cedula: usuarioConRoles.cedula,
        categoriaId: usuarioConRoles.categoriaId,
        disciplinaId: usuarioConRoles.disciplinaId,
        rolIds: usuarioConRoles.usuariosRol.map((ur) => ur.rolId),
      };
    });
  }

  findAll(): Promise<ResponseUserDto[]> {
    return this.prisma.usuario
      .findMany({
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
          cedula: true,
          categoriaId: true,
          disciplinaId: true,
          usuariosRol: {
            select: {
              rolId: true,
            },
          },
        },
        where: {
          deleted: false,
        },
      })
      .then((users) =>
        users.map((user) => ({
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido,
          cedula: user.cedula,
          categoriaId: user.categoriaId,
          disciplinaId: user.disciplinaId,
          rolIds: user.usuariosRol.map((ur) => ur.rolId),
        })),
      );
  }

  async findOne(id: number): Promise<ResponseUserDto> {
    const user = await this.prisma.usuario.findUnique({
      where: {
        id,
        deleted: false,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        cedula: true,
        categoriaId: true,
        disciplinaId: true,
        usuariosRol: {
          select: {
            rolId: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      cedula: user.cedula,
      categoriaId: user.categoriaId,
      disciplinaId: user.disciplinaId,
      rolIds: user.usuariosRol.map((ur) => ur.rolId),
    };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const user = await this.prisma.usuario.findUnique({
      where: { id, deleted: false },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado o deshabilitado');
    }

    await this.validateUserData(updateUserDto, true, id);

    const { categoriaId, disciplinaId, rolIds, password, ...data } =
      updateUserDto;
    const hashedPassword = password
      ? await this.passwordService.hashPassword(password)
      : undefined;

    return this.prisma.$transaction(async (tx) => {
      // Actualizar usuario y obtener datos completos
      const updatedUser = await tx.usuario.update({
        where: { id },
        data: {
          ...data,
          email: updateUserDto.email ?? undefined,
          nombre: updateUserDto.nombre ?? undefined,
          apellido: updateUserDto.apellido ?? undefined,
          cedula: updateUserDto.cedula ?? undefined,
          password: hashedPassword,
          updatedAt: new Date(),
          categoriaId,
          disciplinaId,
          usuariosRol: rolIds
            ? {
                deleteMany: {},
                create: rolIds.map((rolId) => ({
                  rolId,
                  created_at: new Date(),
                  updated_at: new Date(),
                })),
              }
            : undefined,
        },
        include: {
          usuariosRol: {
            select: {
              rolId: true,
            },
          },
        },
      });

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        nombre: updatedUser.nombre,
        apellido: updatedUser.apellido,
        cedula: updatedUser.cedula,
        categoriaId: updatedUser.categoriaId,
        disciplinaId: updatedUser.disciplinaId,
        rolIds: updatedUser.usuariosRol.map((ur) => ur.rolId),
      };
    });
  }

  async softDelete(id: number): Promise<{ id: number }> {
    const user = await this.prisma.usuario.findFirst({
      where: { id, deleted: false },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario con ID ${id} no encontrado o ya eliminado`,
      );
    }

    await this.prisma.usuario.update({
      where: { id },
      data: { deleted: true, updatedAt: new Date() },
    });

    return { id };
  }
}
