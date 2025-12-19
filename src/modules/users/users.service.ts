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
import { PaginationHelper } from 'src/common/herlpers/pagination.helper';
import { PaginationMetaDto } from 'src/common/dtos/pagination-meta.dto';
import { DeletedResourceDto } from 'src/common/dtos/deleted-resource.dto';
import { ValidationService } from 'src/common/services/validation/validation.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Rol } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private validationService: ValidationService,
  ) {}

  async create(data: CreateUserDto): Promise<ResponseUserDto> {
    const roles = await this.validateUserData(data);
    const hashedPassword = await this.passwordService.hashPassword(
      data.password,
    );

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
        data: roles.map((rol) => ({
          usuarioId: usuario.id,
          rolId: rol.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      });

      return {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        cedula: usuario.cedula,
        categoriaId: usuario.categoriaId,
        disciplinaId: usuario.disciplinaId,
        roles: roles.map((rol) => rol.nombre),
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
              rol: {
                select: {
                  nombre: true,
                },
              },
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
          roles: user.usuariosRol.map((ur) => ur.rol.nombre),
        })),
      );
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{
    items: ResponseUserDto[];
    pagination: PaginationMetaDto;
  }> {
    const { skip, take } = PaginationHelper.buildPagination(page, limit);

    const [total, users] = await this.prisma.$transaction([
      this.prisma.usuario.count({ where: { deleted: false } }),
      this.prisma.usuario.findMany({
        skip,
        take,
        where: { deleted: false },
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
          cedula: true,
          categoriaId: true,
          disciplinaId: true,
          pushToken: true,
          usuariosRol: {
            select: {
              rol: {
                select: {
                  nombre: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const items: ResponseUserDto[] = users.map((user) => ({
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      cedula: user.cedula,
      categoriaId: user.categoriaId,
      disciplinaId: user.disciplinaId,
      pushToken: user.pushToken ?? undefined,
      roles: user.usuariosRol.map((ur) => ur.rol.nombre),
    }));

    return PaginationHelper.buildPaginatedResponse(items, total, page, limit);
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
            rol: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      cedula: user.cedula,
      categoriaId: user.categoriaId,
      disciplinaId: user.disciplinaId,
      roles: user.usuariosRol.map((ur) => ur.rol.nombre),
    };
  }

  /**
   * Devuelve todos los usuarios que fueron deshabilitados (deleted = true)
   */
  findDeleted(): Promise<ResponseUserDto[]> {
    return this.prisma.usuario
      .findMany({
        where: { deleted: true },
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
              rol: {
                select: {
                  nombre: true,
                },
              },
            },
          },
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
          roles: user.usuariosRol.map((ur) => ur.rol.nombre),
        })),
      );
  }
  async updateProfile(id: number, dto: UpdateUserProfileDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, roles, ...data } = dto;
    const hashedPassword = password
      ? await this.passwordService.hashPassword(password)
      : undefined;

    return this.prisma.usuario.update({
      where: { id, deleted: false },
      data: {
        ...data,
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });
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

    const { categoriaId, disciplinaId, roles: rolesInput, password, ...data } =
      updateUserDto;
    const roles = await this.validateUserData(updateUserDto, true, id);
    const hashedPassword = password
      ? await this.passwordService.hashPassword(password)
      : undefined;
    const shouldUpdateRoles = Array.isArray(rolesInput);

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
          usuariosRol: shouldUpdateRoles
            ? {
                deleteMany: {},
                create: roles.map((rol) => ({
                  rolId: rol.id,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                })),
              }
            : undefined,
        },
        include: {
          usuariosRol: {
            select: {
              rol: {
                select: {
                  nombre: true,
                },
              },
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
        roles: updatedUser.usuariosRol.map((ur) => ur.rol.nombre),
      };
    });
  }

  async softDelete(id: number): Promise<DeletedResourceDto> {
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

  async restore(id: number): Promise<ResponseUserDto> {
    const user = await this.prisma.usuario.findUnique({
      where: { id, deleted: true },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado o habilitado');
    }

    await this.prisma.usuario.update({
      where: { id },
      data: { deleted: false, updatedAt: new Date() },
    });

    return this.findOne(id);
  }

  async updatePushToken(
    userId: number,
    pushToken: string,
  ): Promise<ResponseUserDto> {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId, deleted: false },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    await this.prisma.usuario.update({
      where: { id: userId },
      data: { pushToken, updatedAt: new Date() },
    });

    return this.findOne(userId);
  }

  private async validateUserData(
    data: CreateUserDto | UpdateUserDto,
    isUpdate = false,
    excludeId?: number,
  ): Promise<Rol[]> {
    if (!isUpdate || data.cedula) {
      await this.validationService.validateUniqueCedula(
        data.cedula || '',
        excludeId,
      );
    }

    let roles: Rol[] = [];
    if (!isUpdate || data.roles) {
      const rolesToValidate = data.roles || [];
      if (rolesToValidate.length === 0) {
        throw new BadRequestException('Debe proporcionar al menos un rol');
      }
      roles = await this.validationService.validateRoles(rolesToValidate);
    }

    if (data.email) {
      await this.validationService.validateUniqueEmail(data.email, excludeId);
    }

    if (data.categoriaId) {
      await this.validationService.validateCategoria(data.categoriaId);
    }

    if (data.disciplinaId) {
      await this.validationService.validateDisciplina(data.disciplinaId);
    }

    return roles;
  }
}
