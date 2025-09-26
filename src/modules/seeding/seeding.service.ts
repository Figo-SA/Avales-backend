import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from '../../common/services/password/password.service';

enum TipoRol {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SECRETARIA = 'SECRETARIA',
  DTM = 'DTM',
  DTM_EIDE = 'DTM_EIDE',
  ENTRENADOR = 'ENTRENADOR',
  USUARIO = 'USUARIO',
  DEPORTISTA = 'DEPORTISTA',
  PDA = 'PDA',
  FINANCIERO = 'FINANCIERO',
}

@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async seedDatabase() {
    try {
      this.logger.log('🚀 Iniciando seeding...');

      // Limpiar la base de datos
      await this.clearDatabase();

      // Resetear secuencias
      await this.resetSequences();

      // Crear datos base
      await this.createCategorias();
      await this.createDisciplinas();
      await this.createRoles();
      await this.createUsuarios();

      this.logger.log('✅ Seeding completado exitosamente');
      return {
        success: true,
        message: 'Base de datos inicializada correctamente',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('❌ Error durante el seeding:', error);
      throw new Error(`Error en el seeding: ${error.message}`);
    }
  }

  private async clearDatabase() {
    await this.prisma.$transaction([
      this.prisma.usuarioRol.deleteMany(),
      this.prisma.usuario.deleteMany(),
      this.prisma.rol.deleteMany(),
      this.prisma.categoria.deleteMany(),
      this.prisma.disciplina.deleteMany(),
    ]);
    this.logger.log('🧹 Base de datos limpiada');
  }

  private async resetSequences() {
    await this.prisma.$executeRaw`ALTER SEQUENCE "Usuario_id_seq" RESTART WITH 1;`;
    await this.prisma.$executeRaw`ALTER SEQUENCE "Rol_id_seq" RESTART WITH 1;`;
    await this.prisma.$executeRaw`ALTER SEQUENCE "Categoria_id_seq" RESTART WITH 1;`;
    await this.prisma.$executeRaw`ALTER SEQUENCE "Disciplina_id_seq" RESTART WITH 1;`;
    this.logger.log('🔄 Secuencias de autoincremento reseteadas');
  }

  private async createCategorias() {
    const categorias = [
      { nombre: 'Infantil', createdAt: new Date() },
      { nombre: 'Juvenil', createdAt: new Date() },
      { nombre: 'Adulto', createdAt: new Date() },
      { nombre: 'Mayores', createdAt: new Date() },
    ];

    await this.prisma.categoria.createMany({
      data: categorias,
      skipDuplicates: true,
    });
    this.logger.log('📋 Categorías creadas');
  }

  private async createDisciplinas() {
    const disciplinas = [
      { nombre: 'Fútbol', createdAt: new Date() },
      { nombre: 'Natación', createdAt: new Date() },
      { nombre: 'Atletismo', createdAt: new Date() },
      { nombre: 'Ciclismo', createdAt: new Date() },
    ];

    await this.prisma.disciplina.createMany({
      data: disciplinas,
      skipDuplicates: true,
    });
    this.logger.log('🏅 Disciplinas creadas');
  }

  private async createRoles() {
    const roles = [
      {
        nombre: TipoRol.SUPER_ADMIN,
        descripcion: 'Administrador con acceso completo a todas las funcionalidades.',
        createdAt: new Date(),
      },
      {
        nombre: TipoRol.ADMIN,
        descripcion: 'Administrador con permisos para gestionar usuarios y configuraciones.',
        createdAt: new Date(),
      },
      {
        nombre: TipoRol.SECRETARIA,
        descripcion: 'Encargada de tareas administrativas y gestión de registros.',
        createdAt: new Date(),
      },
      {
        nombre: TipoRol.DTM_EIDE,
        descripcion: 'Director técnico o manager de equipos.',
        createdAt: new Date(),
      },
      {
        nombre: TipoRol.DTM,
        descripcion: 'Director técnico o manager de equipos.',
        createdAt: new Date(),
      },
      {
        nombre: TipoRol.PDA,
        descripcion: 'Personal de apoyo en actividades deportivas o administrativas.',
        createdAt: new Date(),
      },
      {
        nombre: TipoRol.FINANCIERO,
        descripcion: 'Encargado de la gestión financiera y presupuestos.',
        createdAt: new Date(),
      },
      {
        nombre: TipoRol.ENTRENADOR,
        descripcion: 'Encargado de entrenar y guiar a los atletas.',
        createdAt: new Date(),
      },
    ];

    await this.prisma.rol.createMany({
      data: roles,
      skipDuplicates: true,
    });
    this.logger.log('👑 Roles creados');
  }

  private async createUsuarios() {
    const hashedPassword = await this.passwordService.hashPassword('123456');
    
    const usuarios = [
      {
        nombre: 'Super',
        apellido: 'Admin',
        email: 'superadmin@ejemplo.com',
        password: hashedPassword,
        cedula: '1234567890',
        categoriaId: 1,
        disciplinaId: 1,
        rolId: 1, // super-admin
      },
      {
        nombre: 'Admin',
        apellido: 'Principal',
        email: 'admin@ejemplo.com',
        password: hashedPassword,
        cedula: '1234567891',
        categoriaId: 1,
        disciplinaId: 1,
        rolId: 2, // admin
      },
      {
        nombre: 'Ana',
        apellido: 'Gómez',
        email: 'secretaria@ejemplo.com',
        password: hashedPassword,
        cedula: '1234567892',
        categoriaId: 1,
        disciplinaId: 1,
        rolId: 3, // secretaria
      },
      {
        nombre: 'Carlos',
        apellido: 'López',
        email: 'dtm@ejemplo.com',
        password: hashedPassword,
        cedula: '1234567893',
        categoriaId: 1,
        disciplinaId: 1,
        rolId: 5, // dtm
      },
      {
        nombre: 'María',
        apellido: 'Pérez',
        email: 'pda@ejemplo.com',
        password: hashedPassword,
        cedula: '1234567894',
        categoriaId: 1,
        disciplinaId: 1,
        rolId: 6, // pda
      },
      {
        nombre: 'Juan',
        apellido: 'Martínez',
        email: 'financiero@ejemplo.com',
        password: hashedPassword,
        cedula: '1234567895',
        categoriaId: 1,
        disciplinaId: 1,
        rolId: 7, // financiero
      },
      {
        nombre: 'Luis',
        apellido: 'Rodríguez',
        email: 'entrenador@ejemplo.com',
        password: hashedPassword,
        cedula: '1234567896',
        categoriaId: 1,
        disciplinaId: 1,
        rolId: 8, // entrenador
      },
      {
        nombre: 'Sofía',
        apellido: 'Hernández',
        email: 'entrenador2@ejemplo.com',
        password: hashedPassword,
        cedula: '1234567897',
        categoriaId: 1,
        disciplinaId: 1,
        rolId: 8, // entrenador
      },
      {
        nombre: 'Diego',
        apellido: 'García',
        email: 'pda2@ejemplo.com',
        password: hashedPassword,
        cedula: '1234567898',
        categoriaId: 1,
        disciplinaId: 1,
        rolId: 6, // pda
      },
      {
        nombre: 'Laura',
        apellido: 'Ramírez',
        email: 'secretaria2@ejemplo.com',
        password: hashedPassword,
        cedula: '1234567899',
        categoriaId: 1,
        disciplinaId: 1,
        rolId: 3, // secretaria
      },
    ];

    // Crear usuarios y relaciones en una transacción
    const createdUsuarios = await this.prisma.$transaction(async (tx) => {
      // Crear usuarios
      const insertedUsuarios = await Promise.all(
        usuarios.map(async (user) => {
          const newUser = await tx.usuario.create({
            data: {
              email: user.email,
              password: user.password,
              nombre: user.nombre,
              apellido: user.apellido,
              cedula: user.cedula,
              categoriaId: user.categoriaId,
              disciplinaId: user.disciplinaId,
            },
          });
          return { ...user, id: newUser.id };
        }),
      );

      // Crear relaciones en UsuarioRol
      await tx.usuarioRol.createMany({
        data: insertedUsuarios.map((user) => ({
          usuarioId: user.id,
          rolId: user.rolId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        skipDuplicates: true,
      });

      return insertedUsuarios;
    });

    this.logger.log(`👤 ${createdUsuarios.length} usuarios creados con roles asignados`);
  }

  async getDatabaseStatus() {
    try {
      const [categorias, disciplinas, roles, usuarios, usuarioRoles] = await Promise.all([
        this.prisma.categoria.count(),
        this.prisma.disciplina.count(),
        this.prisma.rol.count(),
        this.prisma.usuario.count(),
        this.prisma.usuarioRol.count(),
      ]);

      return {
        categorias,
        disciplinas,
        roles,
        usuarios,
        usuarioRoles,
        isEmpty: categorias === 0 && disciplinas === 0 && roles === 0 && usuarios === 0,
      };
    } catch (error) {
      this.logger.error('Error obteniendo estado de la base de datos:', error);
      throw new Error('Error al obtener el estado de la base de datos');
    }
  }
}
