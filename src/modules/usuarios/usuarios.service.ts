import { BadRequestException, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto, GetUsuarioDto } from '../usuarios/dto/usuario.dto';
import * as bcrypt from 'bcrypt';
import { PasswordService } from '../../common/services/password/password.service';
import { ValidationService } from 'src/common/services/validation/validation.service';
import { Usuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private validationService: ValidationService,
  ) {}

  async create(
    data: CreateUsuarioDto,
  ): Promise<{ message: string; id: number }> {
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
        select: { id: true },
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
        message: 'Usuario creado correctamente',
        id: usuario.id,
      };
    });
  }

  getAllUsuarios(): Promise<GetUsuarioDto[]> {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        cedula: true,
        categoria_id: true,
        disciplina_id: true,
      },
      where: {
        deleted: false,
      },
    });
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
