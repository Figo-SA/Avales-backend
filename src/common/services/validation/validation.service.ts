import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ValidationService {
  constructor(private prisma: PrismaService) {}

  async validateUniqueEmail(email: string, excludeId?: number): Promise<void> {
    const existingEmail = await this.prisma.usuario.findUnique({
      where: { email, deleted: false },
    });
    if (existingEmail && existingEmail.id !== excludeId) {
      throw new BadRequestException('El correo electrónico ya está registrado');
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
      throw new BadRequestException('La cédula ya está registrada');
    }
  }

  async validateRoles(rolIds: number[]): Promise<void> {
    const roles = await this.prisma.rol.findMany({
      where: { id: { in: rolIds }, deleted: false },
    });
    if (roles.length !== rolIds.length) {
      throw new BadRequestException('Uno o más roles especificados no existen');
    }
  }

  async validateCategoria(id: number): Promise<void> {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id, deleted: false },
    });
    if (!categoria) {
      throw new BadRequestException('La categoría especificada no existe');
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
