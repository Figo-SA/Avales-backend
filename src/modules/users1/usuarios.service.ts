import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto } from './dto/crearUsuario.dto';
import { PasswordService } from '../../common/services/password/password.service';
import { ValidationService } from 'src/common/services/validation/validation.service';
import { UsuariosResponseDto } from './dto/respuestaUsuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private validationService: ValidationService,
  ) {}

  async create(data: CreateUsuarioDto): Promise<UsuariosResponseDto> {
    // Validar los datos del usuario
    await this.validateUsuarioData(data);

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

  async getAllUsuarios(): Promise<UsuariosResponseDto[]> {
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

  private async validateUsuarioData(data: CreateUsuarioDto): Promise<void> {
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
}
