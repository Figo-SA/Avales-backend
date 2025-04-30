import { BadRequestException, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateUsuarioDto,
  UsuarioResponseDto,
} from '../usuarios/dto/usuario.dto';
import * as bcrypt from 'bcrypt';
import { PasswordService } from '../../common/services/password.service';

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    // private jwtService: JwtService,
  ) {}

  async create(
    data: CreateUsuarioDto,
  ): Promise<{ message: string; id: number }> {
    console.log('Creando usuario:', data);
    // Validar email y cédula
    if (data.email) {
      const existingEmail = await this.prisma.usuario.findUnique({
        where: { email: data.email, deleted: false },
      });
      if (existingEmail) {
        throw new BadRequestException(
          'El correo electrónico ya está registrado',
        );
      }
    }

    const existingCedula = await this.prisma.usuario.findUnique({
      where: { cedula: data.cedula, deleted: false },
    });
    if (existingCedula) {
      throw new BadRequestException('La cédula ya está registrada');
    }

    // Validar que todos los roles existan
    const roles = await this.prisma.rol.findMany({
      where: {
        id: { in: data.rol_ids },
        deleted: false,
      },
    });
    if (roles.length !== data.rol_ids.length) {
      throw new BadRequestException('Uno o más roles especificados no existen');
    }

    // Validar categoría y disciplina (si se proporcionan)
    if (data.categoria_id) {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id: data.categoria_id, deleted: false },
      });
      if (!categoria) {
        throw new BadRequestException('La categoría especificada no existe');
      }
    }

    if (data.disciplina_id) {
      const disciplina = await this.prisma.disciplina.findUnique({
        where: { id: data.disciplina_id, deleted: false },
      });
      if (!disciplina) {
        throw new BadRequestException('La disciplina especificada no existe');
      }
    }

    const hashedPassword = await this.passwordService.hashPassword(
      data.password,
    );

    // Crear usuario y relaciones con roles en una transacción
    return this.prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          email: data.email,
          password: hashedPassword,
          nombre: data.nombre,
          apellido: data.apellido ?? '',
          cedula: data.cedula,
          categoria_id: data.categoria_id ?? 1,
          disciplina_id: data.disciplina_id ?? 1,
        },
        include: {
          Categoria: true,
          Disciplina: true,
        },
      });

      // Asignar roles al usuario
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
}
