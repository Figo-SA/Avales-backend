import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from '../../common/services/password/password.service';
import { Genero, Estado } from '@prisma/client';

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
      await this.createEventos();

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
      this.prisma.coleccionAval.deleteMany(),
      this.prisma.evento.deleteMany(),
      this.prisma.usuario.deleteMany(),
      this.prisma.rol.deleteMany(),
      this.prisma.categoria.deleteMany(),
      this.prisma.disciplina.deleteMany(),
    ]);
    this.logger.log('🧹 Base de datos limpiada');
  }

  private async resetSequences() {
    await this.prisma
      .$executeRaw`ALTER SEQUENCE "Usuario_id_seq" RESTART WITH 1;`;
    await this.prisma.$executeRaw`ALTER SEQUENCE "Rol_id_seq" RESTART WITH 1;`;
    await this.prisma
      .$executeRaw`ALTER SEQUENCE "Categoria_id_seq" RESTART WITH 1;`;
    await this.prisma
      .$executeRaw`ALTER SEQUENCE "Disciplina_id_seq" RESTART WITH 1;`;
    await this.prisma
      .$executeRaw`ALTER SEQUENCE "Evento_id_seq" RESTART WITH 1;`;
    await this.prisma
      .$executeRaw`ALTER SEQUENCE "ColeccionAval_id_seq" RESTART WITH 1;`;
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
        descripcion:
          'Administrador con acceso completo a todas las funcionalidades.',
        createdAt: new Date(),
      },
      {
        nombre: TipoRol.ADMIN,
        descripcion:
          'Administrador con permisos para gestionar usuarios y configuraciones.',
        createdAt: new Date(),
      },
      {
        nombre: TipoRol.SECRETARIA,
        descripcion:
          'Encargada de tareas administrativas y gestión de registros.',
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
        descripcion:
          'Personal de apoyo en actividades deportivas o administrativas.',
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

    this.logger.log(
      `👤 ${createdUsuarios.length} usuarios creados con roles asignados`,
    );
  }

  private async createEventos() {
    const eventos = [
      // Eventos DISPONIBLES (recién creados, abiertos para solicitudes)
      {
        codigo: 'EV-AJD-001',
        tipoParticipacion: 'PARTICIPACION',
        tipoEvento: 'CAMPEONATO',
        nombre: 'Campeonato Nacional Oficial Sub 16 Ajedrez',
        genero: Genero.MASCULINO_FEMENINO,
        disciplinaNombre: 'Atletismo',
        categoriaNombre: 'Juvenil',
        alcance: 'NACIONAL',
        lugar: 'Centro Deportivo',
        provincia: 'Pichincha',
        ciudad: 'Quito',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-03-12T09:00:00Z'),
        fechaFin: new Date('2025-03-16T18:00:00Z'),
        numEntrenadoresHombres: 1,
        numEntrenadoresMujeres: 0,
        numAtletasHombres: 3,
        numAtletasMujeres: 3,
        estado: Estado.DISPONIBLE,
      },
      {
        codigo: 'EV-FUT-002',
        tipoParticipacion: 'ORGANIZACION',
        tipoEvento: 'TORNEO',
        nombre: 'Torneo Provincial de Fútbol Sub 18',
        genero: Genero.MASCULINO,
        disciplinaNombre: 'Fútbol',
        categoriaNombre: 'Juvenil',
        alcance: 'PROVINCIAL',
        lugar: 'Estadio Reina del Cisne',
        provincia: 'Loja',
        ciudad: 'Loja',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-06-01T09:00:00Z'),
        fechaFin: new Date('2025-06-10T18:00:00Z'),
        numEntrenadoresHombres: 5,
        numEntrenadoresMujeres: 0,
        numAtletasHombres: 120,
        numAtletasMujeres: 0,
        estado: Estado.DISPONIBLE,
      },
      {
        codigo: 'EV-NAT-003',
        tipoParticipacion: 'PARTICIPACION',
        tipoEvento: 'CAMPEONATO',
        nombre: 'Campeonato Nacional de Natación',
        genero: Genero.MASCULINO_FEMENINO,
        disciplinaNombre: 'Natación',
        categoriaNombre: 'Adulto',
        alcance: 'NACIONAL',
        lugar: 'Piscina Olímpica',
        provincia: 'Guayas',
        ciudad: 'Guayaquil',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-07-15T09:00:00Z'),
        fechaFin: new Date('2025-07-20T18:00:00Z'),
        numEntrenadoresHombres: 3,
        numEntrenadoresMujeres: 2,
        numAtletasHombres: 50,
        numAtletasMujeres: 40,
        estado: Estado.DISPONIBLE,
      },

      // Eventos SOLICITADOS (en proceso de revisión)
      {
        codigo: 'EV-CIC-004',
        tipoParticipacion: 'PARTICIPACION',
        tipoEvento: 'CLASIFICATORIO',
        nombre: 'Clasificatorio Nacional de Ciclismo Ruta',
        genero: Genero.MASCULINO_FEMENINO,
        disciplinaNombre: 'Ciclismo',
        categoriaNombre: 'Mayores',
        alcance: 'NACIONAL',
        lugar: 'Ruta Andina',
        provincia: 'Tungurahua',
        ciudad: 'Ambato',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-09-01T07:00:00Z'),
        fechaFin: new Date('2025-09-05T17:00:00Z'),
        numEntrenadoresHombres: 4,
        numEntrenadoresMujeres: 1,
        numAtletasHombres: 80,
        numAtletasMujeres: 20,
        estado: Estado.SOLICITADO,
      },
      {
        codigo: 'EV-ATL-005',
        tipoParticipacion: 'ORGANIZACION',
        tipoEvento: 'TORNEO',
        nombre: 'Torneo Intercolegial de Atletismo',
        genero: Genero.MASCULINO_FEMENINO,
        disciplinaNombre: 'Atletismo',
        categoriaNombre: 'Infantil',
        alcance: 'CANTONAL',
        lugar: 'Coliseo Municipal',
        provincia: 'Loja',
        ciudad: 'Loja',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-05-01T09:00:00Z'),
        fechaFin: new Date('2025-05-03T18:00:00Z'),
        numEntrenadoresHombres: 2,
        numEntrenadoresMujeres: 1,
        numAtletasHombres: 60,
        numAtletasMujeres: 40,
        estado: Estado.SOLICITADO,
      },
      {
        codigo: 'EV-VOL-006',
        tipoParticipacion: 'PARTICIPACION',
        tipoEvento: 'CAMPEONATO',
        nombre: 'Campeonato Provincial de Voleibol',
        genero: Genero.FEMENINO,
        disciplinaNombre: 'Natación',
        categoriaNombre: 'Juvenil',
        alcance: 'PROVINCIAL',
        lugar: 'Complejo Deportivo Central',
        provincia: 'Azuay',
        ciudad: 'Cuenca',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-04-10T08:00:00Z'),
        fechaFin: new Date('2025-04-14T19:00:00Z'),
        numEntrenadoresHombres: 1,
        numEntrenadoresMujeres: 2,
        numAtletasHombres: 0,
        numAtletasMujeres: 24,
        estado: Estado.SOLICITADO,
      },

      // Eventos ACEPTADOS (aprobados, confirmados)
      {
        codigo: 'EV-BAS-007',
        tipoParticipacion: 'PARTICIPACION',
        tipoEvento: 'TORNEO',
        nombre: 'Torneo Internacional de Básquet Sub 20',
        genero: Genero.MASCULINO,
        disciplinaNombre: 'Fútbol',
        categoriaNombre: 'Juvenil',
        alcance: 'INTERNACIONAL',
        lugar: 'Coliseo George Capwell',
        provincia: 'Guayas',
        ciudad: 'Guayaquil',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-08-05T10:00:00Z'),
        fechaFin: new Date('2025-08-12T20:00:00Z'),
        numEntrenadoresHombres: 3,
        numEntrenadoresMujeres: 0,
        numAtletasHombres: 15,
        numAtletasMujeres: 0,
        estado: Estado.ACEPTADO,
      },
      {
        codigo: 'EV-TEN-008',
        tipoParticipacion: 'ORGANIZACION',
        tipoEvento: 'CAMPEONATO',
        nombre: 'Campeonato Nacional de Tenis Individual',
        genero: Genero.MASCULINO_FEMENINO,
        disciplinaNombre: 'Atletismo',
        categoriaNombre: 'Adulto',
        alcance: 'NACIONAL',
        lugar: 'Club de Tenis Jacaranda',
        provincia: 'Pichincha',
        ciudad: 'Quito',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-10-01T08:00:00Z'),
        fechaFin: new Date('2025-10-08T18:00:00Z'),
        numEntrenadoresHombres: 2,
        numEntrenadoresMujeres: 2,
        numAtletasHombres: 30,
        numAtletasMujeres: 25,
        estado: Estado.ACEPTADO,
      },
      {
        codigo: 'EV-MAR-009',
        tipoParticipacion: 'PARTICIPACION',
        tipoEvento: 'COMPETENCIA',
        nombre: 'Maratón Internacional Ciudad de Quito',
        genero: Genero.MASCULINO_FEMENINO,
        disciplinaNombre: 'Atletismo',
        categoriaNombre: 'Mayores',
        alcance: 'INTERNACIONAL',
        lugar: 'Centro Histórico',
        provincia: 'Pichincha',
        ciudad: 'Quito',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-11-15T06:00:00Z'),
        fechaFin: new Date('2025-11-15T14:00:00Z'),
        numEntrenadoresHombres: 5,
        numEntrenadoresMujeres: 3,
        numAtletasHombres: 200,
        numAtletasMujeres: 150,
        estado: Estado.ACEPTADO,
      },

      // Eventos RECHAZADOS (no aprobados)
      {
        codigo: 'EV-BOX-010',
        tipoParticipacion: 'PARTICIPACION',
        tipoEvento: 'TORNEO',
        nombre: 'Torneo Regional de Boxeo Amateur',
        genero: Genero.MASCULINO,
        disciplinaNombre: 'Fútbol',
        categoriaNombre: 'Juvenil',
        alcance: 'REGIONAL',
        lugar: 'Gimnasio Municipal',
        provincia: 'El Oro',
        ciudad: 'Machala',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-06-20T16:00:00Z'),
        fechaFin: new Date('2025-06-22T21:00:00Z'),
        numEntrenadoresHombres: 2,
        numEntrenadoresMujeres: 0,
        numAtletasHombres: 16,
        numAtletasMujeres: 0,
        estado: Estado.RECHAZADO,
      },
      {
        codigo: 'EV-KAR-011',
        tipoParticipacion: 'ORGANIZACION',
        tipoEvento: 'CAMPEONATO',
        nombre: 'Campeonato Provincial de Karate',
        genero: Genero.MASCULINO_FEMENINO,
        disciplinaNombre: 'Atletismo',
        categoriaNombre: 'Infantil',
        alcance: 'PROVINCIAL',
        lugar: 'Polideportivo Central',
        provincia: 'Manabí',
        ciudad: 'Portoviejo',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-05-18T09:00:00Z'),
        fechaFin: new Date('2025-05-20T18:00:00Z'),
        numEntrenadoresHombres: 1,
        numEntrenadoresMujeres: 1,
        numAtletasHombres: 20,
        numAtletasMujeres: 15,
        estado: Estado.RECHAZADO,
      },
      {
        codigo: 'EV-TAE-012',
        tipoParticipacion: 'PARTICIPACION',
        tipoEvento: 'CLASIFICATORIO',
        nombre: 'Clasificatorio Nacional de Taekwondo',
        genero: Genero.MASCULINO_FEMENINO,
        disciplinaNombre: 'Ciclismo',
        categoriaNombre: 'Juvenil',
        alcance: 'NACIONAL',
        lugar: 'Estadio Cubierto',
        provincia: 'Chimborazo',
        ciudad: 'Riobamba',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-07-25T08:00:00Z'),
        fechaFin: new Date('2025-07-28T19:00:00Z'),
        numEntrenadoresHombres: 2,
        numEntrenadoresMujeres: 2,
        numAtletasHombres: 30,
        numAtletasMujeres: 25,
        estado: Estado.RECHAZADO,
      },

      // Más eventos DISPONIBLES
      {
        codigo: 'EV-ESG-013',
        tipoParticipacion: 'ORGANIZACION',
        tipoEvento: 'TORNEO',
        nombre: 'Torneo Provincial de Esgrima',
        genero: Genero.MASCULINO_FEMENINO,
        disciplinaNombre: 'Natación',
        categoriaNombre: 'Adulto',
        alcance: 'PROVINCIAL',
        lugar: 'Centro de Alto Rendimiento',
        provincia: 'Pichincha',
        ciudad: 'Quito',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-09-10T09:00:00Z'),
        fechaFin: new Date('2025-09-13T18:00:00Z'),
        numEntrenadoresHombres: 1,
        numEntrenadoresMujeres: 1,
        numAtletasHombres: 12,
        numAtletasMujeres: 10,
        estado: Estado.DISPONIBLE,
      },
      {
        codigo: 'EV-GIM-014',
        tipoParticipacion: 'PARTICIPACION',
        tipoEvento: 'CAMPEONATO',
        nombre: 'Campeonato Nacional de Gimnasia Artística',
        genero: Genero.FEMENINO,
        disciplinaNombre: 'Atletismo',
        categoriaNombre: 'Infantil',
        alcance: 'NACIONAL',
        lugar: 'Coliseo de la Ciudad',
        provincia: 'Azuay',
        ciudad: 'Cuenca',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-08-20T08:00:00Z'),
        fechaFin: new Date('2025-08-24T19:00:00Z'),
        numEntrenadoresHombres: 0,
        numEntrenadoresMujeres: 3,
        numAtletasHombres: 0,
        numAtletasMujeres: 35,
        estado: Estado.DISPONIBLE,
      },
      {
        codigo: 'EV-TRI-015',
        tipoParticipacion: 'PARTICIPACION',
        tipoEvento: 'COMPETENCIA',
        nombre: 'Triatlón Internacional Costa del Pacífico',
        genero: Genero.MASCULINO_FEMENINO,
        disciplinaNombre: 'Ciclismo',
        categoriaNombre: 'Adulto',
        alcance: 'INTERNACIONAL',
        lugar: 'Playas de Salinas',
        provincia: 'Santa Elena',
        ciudad: 'Salinas',
        pais: 'Ecuador',
        fechaInicio: new Date('2025-12-01T06:00:00Z'),
        fechaFin: new Date('2025-12-01T15:00:00Z'),
        numEntrenadoresHombres: 4,
        numEntrenadoresMujeres: 2,
        numAtletasHombres: 45,
        numAtletasMujeres: 30,
        estado: Estado.DISPONIBLE,
      },
    ];

    for (const evento of eventos) {
      const disciplina = await this.prisma.disciplina.findFirst({
        where: { nombre: evento.disciplinaNombre },
      });

      const categoria = await this.prisma.categoria.findFirst({
        where: { nombre: evento.categoriaNombre },
      });

      if (!disciplina || !categoria) {
        this.logger.warn(
          `⚠️ No se encontró disciplina o categoría para evento: ${evento.nombre}`,
        );
        continue;
      }

      await this.prisma.evento.create({
        data: {
          codigo: evento.codigo,
          tipoParticipacion: evento.tipoParticipacion,
          tipoEvento: evento.tipoEvento,
          nombre: evento.nombre,
          genero: evento.genero,
          disciplinaId: disciplina.id,
          categoriaId: categoria.id,
          alcance: evento.alcance,
          lugar: evento.lugar,
          provincia: evento.provincia,
          ciudad: evento.ciudad,
          pais: evento.pais,
          fechaInicio: evento.fechaInicio,
          fechaFin: evento.fechaFin,
          numEntrenadoresHombres: evento.numEntrenadoresHombres,
          numEntrenadoresMujeres: evento.numEntrenadoresMujeres,
          numAtletasHombres: evento.numAtletasHombres,
          numAtletasMujeres: evento.numAtletasMujeres,
          estado: evento.estado,
        },
      });
    }

    this.logger.log(
      `🎯 ${eventos.length} eventos creados con estados variados`,
    );
  }

  async getDatabaseStatus() {
    try {
      const [categorias, disciplinas, roles, usuarios, usuarioRoles, eventos] =
        await Promise.all([
          this.prisma.categoria.count(),
          this.prisma.disciplina.count(),
          this.prisma.rol.count(),
          this.prisma.usuario.count(),
          this.prisma.usuarioRol.count(),
          this.prisma.evento.count(),
        ]);

      return {
        categorias,
        disciplinas,
        roles,
        usuarios,
        usuarioRoles,
        eventos,
        isEmpty:
          categorias === 0 &&
          disciplinas === 0 &&
          roles === 0 &&
          usuarios === 0 &&
          eventos === 0,
      };
    } catch (error) {
      this.logger.error('Error obteniendo estado de la base de datos:', error);
      throw new Error('Error al obtener el estado de la base de datos');
    }
  }
}
