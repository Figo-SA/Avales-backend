import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/common/services/password/password.service';
import { DeletedResourceDto } from 'src/common/dtos/deleted-resource.dto';
import { ValidationService } from 'src/common/services/validation/validation.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Prisma, Rol } from '@prisma/client';
import {
  UserNotFoundException,
  UserNotDeletedException,
  NoRolesProvidedException,
} from './exceptions/users.exceptions';

/**
 * Select para obtener usuario con relaciones
 */
const userSelect = {
  id: true,
  email: true,
  nombre: true,
  apellido: true,
  cedula: true,
  categoriaId: true,
  disciplinaId: true,
  genero: true,
  pushToken: true,
  createdAt: true,
  updatedAt: true,
  categoria: {
    select: {
      id: true,
      nombre: true,
    },
  },
  disciplina: {
    select: {
      id: true,
      nombre: true,
    },
  },
  usuariosRol: {
    select: {
      rol: {
        select: {
          nombre: true,
        },
      },
    },
  },
} as const;

type UserWithRelations = Prisma.UsuarioGetPayload<{
  select: typeof userSelect;
}>;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private validationService: ValidationService,
  ) {}

  /**
   * Mapea el modelo de Prisma al DTO de respuesta
   * Los campos se devuelven en español para el frontend
   */
  private mapToResponse(user: UserWithRelations): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      apellido: user.apellido,
      cedula: user.cedula,
      categoria: user.categoria,
      disciplina: user.disciplina,
      genero: user.genero ?? undefined,
      roles: user.usuariosRol.map((ur) => ur.rol.nombre),
      pushToken: user.pushToken ?? undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Crear un nuevo usuario
   */
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const roles = await this.validateUserData(dto);
    const hashedPassword = await this.passwordService.hashPassword(dto.password);

    return this.prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          email: dto.email ?? '',
          password: hashedPassword,
          nombre: dto.nombre,
          apellido: dto.apellido ?? '',
          cedula: dto.cedula,
          categoriaId: dto.categoriaId ?? 1,
          disciplinaId: dto.disciplinaId ?? 1,
          genero: dto.genero,
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

      const createdUser = await tx.usuario.findUnique({
        where: { id: usuario.id },
        select: userSelect,
      });

      return this.mapToResponse(createdUser as UserWithRelations);
    });
  }

  /**
   * Listar usuarios con paginación
   */
  async findAll(query: UserQueryDto): Promise<{
    items: UserResponseDto[];
    pagination: { page: number; limit: number; total: number };
  }> {
    const { page, limit, genero } = query;
    const skip = (page - 1) * limit;

    const where: any = { deleted: false };

    // Filtrar por género si se proporciona
    if (genero) {
      where.genero = genero;
    }

    const [total, users] = await this.prisma.$transaction([
      this.prisma.usuario.count({ where }),
      this.prisma.usuario.findMany({
        skip,
        take: limit,
        where,
        select: userSelect,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const items = users.map((user) => this.mapToResponse(user));

    return {
      items,
      pagination: { page, limit, total },
    };
  }

  /**
   * Listar solo usuarios con rol ENTRENADOR (paginado)
   */
  async findEntrenadores(query: UserQueryDto): Promise<{
    items: UserResponseDto[];
    pagination: { page: number; limit: number; total: number };
  }> {
    const { page, limit, genero } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      deleted: false,
      usuariosRol: {
        some: {
          rol: {
            nombre: 'ENTRENADOR',
          },
        },
      },
    };

    // Filtrar por género si se proporciona
    if (genero) {
      where.genero = genero;
    }

    const [total, users] = await this.prisma.$transaction([
      this.prisma.usuario.count({ where }),
      this.prisma.usuario.findMany({
        skip,
        take: limit,
        where,
        select: userSelect,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const items = users.map((user) => this.mapToResponse(user));

    return {
      items,
      pagination: { page, limit, total },
    };
  }

  /**
   * Obtener un usuario por ID
   */
  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.usuario.findUnique({
      where: { id, deleted: false },
      select: userSelect,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return this.mapToResponse(user);
  }

  /**
   * Obtener usuarios eliminados (soft deleted)
   */
  async findDeleted(): Promise<UserResponseDto[]> {
    const users = await this.prisma.usuario.findMany({
      where: { deleted: true },
      select: userSelect,
    });

    return users.map((user) => this.mapToResponse(user));
  }

  /**
   * Actualizar perfil del usuario autenticado
   */
  async updateProfile(
    id: number,
    dto: UpdateUserProfileDto,
  ): Promise<UserResponseDto> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, roles, ...data } = dto;
    const hashedPassword = password
      ? await this.passwordService.hashPassword(password)
      : undefined;

    const updatedUser = await this.prisma.usuario.update({
      where: { id, deleted: false },
      data: {
        ...data,
        password: hashedPassword,
        updatedAt: new Date(),
      },
      select: userSelect,
    });

    return this.mapToResponse(updatedUser);
  }

  /**
   * Actualizar un usuario (admin)
   */
  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.usuario.findUnique({
      where: { id, deleted: false },
      select: { id: true },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    const {
      categoriaId,
      disciplinaId,
      roles: rolesInput,
      password,
      ...data
    } = dto;
    const roles = await this.validateUserData(dto, true, id);
    const hashedPassword = password
      ? await this.passwordService.hashPassword(password)
      : undefined;
    const shouldUpdateRoles = Array.isArray(rolesInput);

    return this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.usuario.update({
        where: { id },
        data: {
          ...data,
          email: dto.email ?? undefined,
          nombre: dto.nombre ?? undefined,
          apellido: dto.apellido ?? undefined,
          cedula: dto.cedula ?? undefined,
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
        select: userSelect,
      });

      return this.mapToResponse(updatedUser);
    });
  }

  /**
   * Soft delete - marcar como eliminado
   */
  async softDelete(id: number): Promise<DeletedResourceDto> {
    const user = await this.prisma.usuario.findFirst({
      where: { id, deleted: false },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    await this.prisma.usuario.update({
      where: { id },
      data: { deleted: true, updatedAt: new Date() },
    });

    return { id };
  }

  /**
   * Restaurar un usuario eliminado
   */
  async restore(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.usuario.findUnique({
      where: { id, deleted: true },
      select: { id: true },
    });

    if (!user) {
      throw new UserNotDeletedException();
    }

    await this.prisma.usuario.update({
      where: { id },
      data: { deleted: false, updatedAt: new Date() },
    });

    return this.findOne(id);
  }

  /**
   * Actualizar push token del usuario
   */
  async updatePushToken(
    userId: number,
    pushToken: string,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId, deleted: false },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    await this.prisma.usuario.update({
      where: { id: userId },
      data: { pushToken, updatedAt: new Date() },
    });

    return this.findOne(userId);
  }

  /**
   * Validar datos del usuario (unicidad, roles, categoría, disciplina)
   */
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
        throw new NoRolesProvidedException();
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
