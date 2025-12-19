import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Rol, TipoRol } from '@prisma/client';

@Injectable()
export class ValidationService {
  constructor(private prisma: PrismaService) {}

  async validateUniqueEmail(email: string, excludeId?: number): Promise<void> {
    const existingEmail = await this.prisma.usuario.findUnique({
      where: { email, deleted: false },
    });
    if (existingEmail && existingEmail.id !== excludeId) {
      throw new BadRequestException('El correo electr¢nico ya est  registrado');
    }
  }

  async validateUniqueCedula(
    cedula: string,
    excludeId?: number,
  ): Promise<void> {
    const existingCedula = await this.prisma.usuario.findFirst({
      where: { cedula, deleted: false },
    });
    if (existingCedula && existingCedula.id !== excludeId) {
      throw new BadRequestException('La c‚dula ya est  registrada');
    }
  }

  async validateUniqueCedulaDeportista(
    cedula: string,
    excludeId?: number,
  ): Promise<void> {
    const existingCedula = await this.prisma.deportista.findFirst({
      where: { cedula, deleted: false },
    });
    console.log('Validando c‚dula en deportista:', cedula, existingCedula);
    if (existingCedula && existingCedula.id !== excludeId) {
      throw new BadRequestException('La c‚dula ya est  registrada');
    }
  }

  async validateRoles(roleNames: TipoRol[]): Promise<Rol[]> {
    const uniqueRoles = Array.from(new Set(roleNames));
    if (uniqueRoles.length === 0) {
      throw new BadRequestException('Debe proporcionar al menos un rol');
    }

    const roles = await this.prisma.rol.findMany({
      where: { nombre: { in: uniqueRoles }, deleted: false },
    });

    if (roles.length !== uniqueRoles.length) {
      const found = roles.map((rol) => rol.nombre);
      const missing = uniqueRoles.filter((name) => !found.includes(name));

      throw new BadRequestException(
        `Uno o m s roles especificados no existen: ${missing.join(', ')}`,
      );
    }

    return roles;
  }

  async validateCategoria(id: number): Promise<void> {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id, deleted: false },
    });
    if (!categoria) {
      throw new BadRequestException('La categor¡a especificada no existe');
    }
  }

  async validateDisciplina(id: number): Promise<void> {
    const disciplina = await this.prisma.disciplina.findUnique({
      where: { id, deleted: false },
    });
    if (!disciplina) {
      throw new BadRequestException('La disciplina especificada no existe');
    }
  }
}
