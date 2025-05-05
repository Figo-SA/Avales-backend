import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/common/services/password/password.service';
import { ValidationService } from 'src/common/services/validation/validation.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private validationService: ValidationService,
  ) {}

  private async validateUserData(data: CreateUserDto): Promise<void> {
    // Comprobar si el email y la cédula son únicos
    if (data.email)
      await this.validationService.validateUniqueEmail(data.email);
    await this.validationService.validateUniqueCedula(data.cedula);
    await this.validationService.validateRoles(data.rol_ids);
    // Comprobar si la categoría y disciplina existen
    if (data.categoria_id)
      await this.validationService.validateCategoria(data.categoria_id);
    if (data.disciplina_id)
      await this.validationService.validateDisciplina(data.disciplina_id);
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

      await tx.usuarioRol.createMany({
        data: data.rol_ids.map((rol_id) => ({
          usuario_id: usuario.id,
          rol_id,
          created_at: new Date(),
          updated_at: new Date(),
        })),
      });

      return {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        cedula: usuario.cedula,
        categoria_id: usuario.categoria_id,
        disciplina_id: usuario.disciplina_id,
        rol_ids: usuario.UsuariosRol.map((ur) => ur.rol_id),
      };
    });
  }

  findAll() {
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
