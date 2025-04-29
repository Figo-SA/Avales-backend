import { BadRequestException, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto } from '../auth/dto/usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    private prisma: PrismaService,
    // private jwtService: JwtService,
  ) {}

  async create(data: CreateUsuarioDto) {
    console.log(data);
    // // Verificar si el email ya existe
    // if (data.email) {
    //   const existingEmail = await this.prisma.usuario.findUnique({
    //     where: { email: data.email },
    //   });
    //   if (existingEmail) {
    //     throw new BadRequestException(
    //       'El correo electrónico ya está registrado',
    //     );
    //   }
    // }
    // // Verificar si la cédula ya existe
    // const existingCedula = await this.prisma.usuario.findUnique({
    //   where: { cedula: data.cedula },
    // });
    // if (existingCedula) {
    //   throw new BadRequestException('La cédula ya está registrada');
    // }
    // const hashedPassword = await bcrypt.hash(data.password, 10);
    // return this.prisma.usuario.create({
    //   data: {
    //     email: data.email,
    //     password: hashedPassword,
    //     nombre: data.nombre,
    //     apellido: data.apellido,
    //     cedula: data.cedula,
    //     categoria_id: 1,
    //     disciplina_id: 1,
    //   },
    //   include: {
    //     Categoria: true,
    //     Disciplina: true,
    //   },
    // });
  }
}
