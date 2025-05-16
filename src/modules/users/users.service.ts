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
    if (!isUpdate || data.rol_ids) {
      const rolIds = data.rol_ids || [];
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
    if (data.categoria_id) {
      await this.validationService.validateCategoria(data.categoria_id);
    }

    if (data.disciplina_id) {
      await this.validationService.validateDisciplina(data.disciplina_id);
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
          categoria_id: data.categoria_id ?? 1,
          disciplina_id: data.disciplina_id ?? 1,
        },
      });

      await tx.usuarioRol.createMany({
        data: data.rol_ids.map((rol_id) => ({
          usuario_id: usuario.id,
          rol_id,
          created_at: new Date(),
          updated_at: new Date(),
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
          categoria_id: true,
          disciplina_id: true,
          UsuariosRol: {
            select: {
              rol_id: true,
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
        categoria_id: usuarioConRoles.categoria_id,
        disciplina_id: usuarioConRoles.disciplina_id,
        rol_ids: usuarioConRoles.UsuariosRol.map((ur) => ur.rol_id),
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
          categoria_id: true,
          disciplina_id: true,
          UsuariosRol: {
            select: {
              rol_id: true,
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
          categoria_id: user.categoria_id,
          disciplina_id: user.disciplina_id,
          rol_ids: user.UsuariosRol.map((ur) => ur.rol_id),
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
        categoria_id: true,
        disciplina_id: true,
        UsuariosRol: {
          select: {
            rol_id: true,
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
      categoria_id: user.categoria_id,
      disciplina_id: user.disciplina_id,
      rol_ids: user.UsuariosRol.map((ur) => ur.rol_id),
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

    const { categoria_id, disciplina_id, rol_ids, password, ...data } =
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
          updated_at: new Date(),
          categoria_id,
          disciplina_id,
          UsuariosRol: rol_ids
            ? {
                deleteMany: {},
                create: rol_ids.map((rol_id) => ({
                  rol_id,
                  created_at: new Date(),
                  updated_at: new Date(),
                })),
              }
            : undefined,
        },
        include: {
          UsuariosRol: {
            select: {
              rol_id: true,
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
        categoria_id: updatedUser.categoria_id,
        disciplina_id: updatedUser.disciplina_id,
        rol_ids: updatedUser.UsuariosRol.map((ur) => ur.rol_id),
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
      data: { deleted: true, updated_at: new Date() },
    });

    return { id };
  }
}
