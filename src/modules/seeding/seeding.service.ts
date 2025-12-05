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
      await this.createRubros();
      await this.createRoles();
      await this.createUsuarios();
      // Crear entrenadores independientes (tabla separada)
      await this.createEntrenadores();
      await this.createEventos();
      await this.createDeportistas();

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
    // Delete child/relationship tables first to avoid FK constraint violations
    await this.prisma.$transaction([
      // Deportista-related
      this.prisma.deportistaAval.deleteMany(),

      // PDA / Financiero / DTM related items & history
      this.prisma.pdaItem.deleteMany(),
      this.prisma.financieroItem.deleteMany(),
      this.prisma.historialPda.deleteMany(),
      this.prisma.historialDtm.deleteMany(),
      this.prisma.historialFinanciero.deleteMany(),

      // Main PDA/DTM/Financiero records
      this.prisma.pda.deleteMany(),
      this.prisma.dtm.deleteMany(),
      this.prisma.financiero.deleteMany(),

      // Aval (technical) related
      this.prisma.avalRequerimiento.deleteMany(),
      this.prisma.avalCriterio.deleteMany(),
      this.prisma.avalObjetivo.deleteMany(),
      this.prisma.historialAvalTecnico.deleteMany(),
      this.prisma.avalTecnico.deleteMany(),

      // Colección and its relations
      this.prisma.coleccionEntrenador.deleteMany(),
      // Entrenadores (delete colecciones first above)
      this.prisma.entrenador.deleteMany(),
      this.prisma.historialColeccion.deleteMany(),
      this.prisma.coleccionAval.deleteMany(),

      // Deportistas (now safe to delete)
      this.prisma.deportista.deleteMany(),

      // Eventos
      this.prisma.evento.deleteMany(),

      // Usuarios & roles
      this.prisma.usuarioRol.deleteMany(),
      this.prisma.usuario.deleteMany(),
      this.prisma.rol.deleteMany(),

      // Catalogs
      this.prisma.categoria.deleteMany(),
      this.prisma.disciplina.deleteMany(),
      this.prisma.rubro.deleteMany(),
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
      .$executeRaw`ALTER SEQUENCE "Rubro_id_seq" RESTART WITH 1;`;
    await this.prisma
      .$executeRaw`ALTER SEQUENCE "Deportista_id_seq" RESTART WITH 1;`;
    await this.prisma
      .$executeRaw`ALTER SEQUENCE "Evento_id_seq" RESTART WITH 1;`;
    await this.prisma
      .$executeRaw`ALTER SEQUENCE "ColeccionAval_id_seq" RESTART WITH 1;`;
    await this.prisma
      .$executeRaw`ALTER SEQUENCE "Entrenador_id_seq" RESTART WITH 1;`;
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

  private async createRubros() {
    const rubros = [
      {
        nombre: 'Hospedaje',
        descripcion: 'Gastos de alojamiento',
        createdAt: new Date(),
      },
      {
        nombre: 'Alimentación',
        descripcion: 'Gastos de alimentación',
        createdAt: new Date(),
      },
      {
        nombre: 'Transporte',
        descripcion: 'Gastos de transporte terrestre',
        createdAt: new Date(),
      },
      {
        nombre: 'Transporte Aéreo',
        descripcion: 'Gastos de pasajes aéreos',
        createdAt: new Date(),
      },
      {
        nombre: 'Inscripción',
        descripcion: 'Costos de inscripción al evento',
        createdAt: new Date(),
      },
      {
        nombre: 'Implementación Deportiva',
        descripcion: 'Equipamiento y materiales',
        createdAt: new Date(),
      },
      {
        nombre: 'Viáticos',
        descripcion: 'Gastos varios del personal',
        createdAt: new Date(),
      },
    ];

    await this.prisma.rubro.createMany({
      data: rubros,
      skipDuplicates: true,
    });
    this.logger.log('💰 Rubros presupuestarios creados');
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
    return createdUsuarios;
  }

  private async createEntrenadores() {
    const entrenadores = [
      {
        nombres: 'Andrés',
        apellidos: 'Mendoza',
        cedula: '2000000001',
        fechaNacimiento: new Date('1980-01-01'),
        categoriaId: 1,
        disciplinaId: 1,
        afiliacion: true,
        genero: Genero.MASCULINO,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      },
      {
        nombres: 'María',
        apellidos: 'Suárez',
        cedula: '2000000002',
        fechaNacimiento: new Date('1985-06-15'),
        categoriaId: 1,
        disciplinaId: 2,
        afiliacion: true,
        genero: Genero.FEMENINO,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      },
      {
        nombres: 'Carlos',
        apellidos: 'Gómez',
        cedula: '2000000003',
        fechaNacimiento: new Date('1975-03-22'),
        categoriaId: 2,
        disciplinaId: 1,
        afiliacion: false,
        genero: Genero.MASCULINO,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      },
      {
        nombres: 'Lucía',
        apellidos: 'Fernández',
        cedula: '2000000004',
        fechaNacimiento: new Date('1990-11-11'),
        categoriaId: 2,
        disciplinaId: 3,
        afiliacion: true,
        genero: Genero.FEMENINO,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      },
      {
        nombres: 'Jorge',
        apellidos: 'López',
        cedula: '2000000005',
        fechaNacimiento: new Date('1982-07-07'),
        categoriaId: 3,
        disciplinaId: 2,
        afiliacion: false,
        genero: Genero.MASCULINO,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      },
      {
        nombres: 'Ana',
        apellidos: 'Ramos',
        cedula: '2000000006',
        fechaNacimiento: new Date('1992-02-20'),
        categoriaId: 3,
        disciplinaId: 4,
        afiliacion: true,
        genero: Genero.FEMENINO,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      },
      {
        nombres: 'Fernando',
        apellidos: 'Castillo',
        cedula: '2000000007',
        fechaNacimiento: new Date('1978-09-30'),
        categoriaId: 1,
        disciplinaId: 2,
        afiliacion: true,
        genero: Genero.MASCULINO,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      },
      {
        nombres: 'Paula',
        apellidos: 'Vargas',
        cedula: '2000000008',
        fechaNacimiento: new Date('1988-12-05'),
        categoriaId: 2,
        disciplinaId: 1,
        afiliacion: false,
        genero: Genero.FEMENINO,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      },
      {
        nombres: 'Diego',
        apellidos: 'Rivera',
        cedula: '2000000009',
        fechaNacimiento: new Date('1984-04-18'),
        categoriaId: 4,
        disciplinaId: 3,
        afiliacion: true,
        genero: Genero.MASCULINO,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      },
      {
        nombres: 'Sofía',
        apellidos: 'Morales',
        cedula: '2000000010',
        fechaNacimiento: new Date('1995-08-23'),
        categoriaId: 4,
        disciplinaId: 4,
        afiliacion: true,
        genero: Genero.FEMENINO,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      },
      {
        nombres: 'Miguel',
        apellidos: 'Pineda',
        cedula: '2000000011',
        fechaNacimiento: new Date('1972-05-02'),
        categoriaId: 1,
        disciplinaId: 1,
        afiliacion: false,
        genero: Genero.MASCULINO,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      },
      {
        nombres: 'Valeria',
        apellidos: 'Quintero',
        cedula: '2000000012',
        fechaNacimiento: new Date('1987-10-10'),
        categoriaId: 2,
        disciplinaId: 2,
        afiliacion: true,
        genero: Genero.FEMENINO,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
      },
    ];

    await this.prisma.entrenador.createMany({
      data: entrenadores,
      skipDuplicates: true,
    });

    this.logger.log(`🏋️ ${entrenadores.length} entrenadores seed creados`);
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

  private async createDeportistas() {
    const now = new Date();
    const fin = new Date();
    fin.setFullYear(fin.getFullYear() + 1);

    const deportistas = [
      // Fútbol
      {
        nombres: 'Carlos Andrés',
        apellidos: 'González Pérez',
        cedula: '1750123456',
        fechaNacimiento: new Date('2005-03-15'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Fútbol',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Diego Alejandro',
        apellidos: 'Morales Gómez',
        cedula: '1750123460',
        fechaNacimiento: new Date('2003-09-30'),
        categoriaNombre: 'Adulto',
        disciplinaNombre: 'Fútbol',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Fernando José',
        apellidos: 'Sánchez Rojas',
        cedula: '1750123464',
        fechaNacimiento: new Date('2004-06-18'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Fútbol',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Mateo Santiago',
        apellidos: 'Jiménez Vega',
        cedula: '1750123465',
        fechaNacimiento: new Date('2006-01-22'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Fútbol',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Sebastián',
        apellidos: 'Ruiz Álvarez',
        cedula: '1750123466',
        fechaNacimiento: new Date('2005-09-14'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Fútbol',
        genero: Genero.MASCULINO,
        afiliacion: false,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Gabriel Antonio',
        apellidos: 'Medina Cruz',
        cedula: '1750123467',
        fechaNacimiento: new Date('2007-03-08'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Fútbol',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },

      // Natación
      {
        nombres: 'María Fernanda',
        apellidos: 'López Martínez',
        cedula: '1750123457',
        fechaNacimiento: new Date('2006-07-22'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Natación',
        genero: Genero.FEMENINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Sofía Isabel',
        apellidos: 'Hernández Ruiz',
        cedula: '1750123461',
        fechaNacimiento: new Date('2008-05-18'),
        categoriaNombre: 'Infantil',
        disciplinaNombre: 'Natación',
        genero: Genero.FEMENINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Camila Andrea',
        apellidos: 'Palacios Moreno',
        cedula: '1750123468',
        fechaNacimiento: new Date('2009-02-25'),
        categoriaNombre: 'Infantil',
        disciplinaNombre: 'Natación',
        genero: Genero.FEMENINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Isabella',
        apellidos: 'Torres Delgado',
        cedula: '1750123469',
        fechaNacimiento: new Date('2005-11-30'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Natación',
        genero: Genero.FEMENINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Lucía Valentina',
        apellidos: 'Reyes Castillo',
        cedula: '1750123470',
        fechaNacimiento: new Date('2007-08-12'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Natación',
        genero: Genero.FEMENINO,
        afiliacion: false,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Emilia',
        apellidos: 'Guerrero Lozano',
        cedula: '1750123471',
        fechaNacimiento: new Date('2004-04-17'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Natación',
        genero: Genero.FEMENINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },

      // Atletismo
      {
        nombres: 'Juan Pablo',
        apellidos: 'Rodríguez Silva',
        cedula: '1750123458',
        fechaNacimiento: new Date('2004-11-08'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Atletismo',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Andrés Felipe',
        apellidos: 'Castro Vargas',
        cedula: '1750123462',
        fechaNacimiento: new Date('2005-12-25'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Atletismo',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Nicolás',
        apellidos: 'Mendoza Paredes',
        cedula: '1750123472',
        fechaNacimiento: new Date('2003-07-05'),
        categoriaNombre: 'Adulto',
        disciplinaNombre: 'Atletismo',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Miguel Ángel',
        apellidos: 'Flores Guzmán',
        cedula: '1750123473',
        fechaNacimiento: new Date('2006-10-20'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Atletismo',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Daniela',
        apellidos: 'Navarro Ríos',
        cedula: '1750123474',
        fechaNacimiento: new Date('2005-05-14'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Atletismo',
        genero: Genero.FEMENINO,
        afiliacion: false,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Paula Andrea',
        apellidos: 'Vargas Soto',
        cedula: '1750123475',
        fechaNacimiento: new Date('2004-12-03'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Atletismo',
        genero: Genero.FEMENINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },

      // Ciclismo
      {
        nombres: 'Ana Gabriela',
        apellidos: 'Ramírez Torres',
        cedula: '1750123459',
        fechaNacimiento: new Date('2007-02-14'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Ciclismo',
        genero: Genero.FEMENINO,
        afiliacion: false,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Valentina',
        apellidos: 'Ortiz Mendoza',
        cedula: '1750123463',
        fechaNacimiento: new Date('2006-04-10'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Ciclismo',
        genero: Genero.FEMENINO,
        afiliacion: false,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Ricardo Javier',
        apellidos: 'Peña Salazar',
        cedula: '1750123476',
        fechaNacimiento: new Date('2003-01-28'),
        categoriaNombre: 'Adulto',
        disciplinaNombre: 'Ciclismo',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Alejandro',
        apellidos: 'Cabrera Núñez',
        cedula: '1750123477',
        fechaNacimiento: new Date('2005-08-19'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Ciclismo',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Martina',
        apellidos: 'Acosta Villalba',
        cedula: '1750123478',
        fechaNacimiento: new Date('2006-06-07'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Ciclismo',
        genero: Genero.FEMENINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Santiago',
        apellidos: 'Bravo Chávez',
        cedula: '1750123479',
        fechaNacimiento: new Date('2004-03-26'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Ciclismo',
        genero: Genero.MASCULINO,
        afiliacion: false,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },

      // Más deportistas
      {
        nombres: 'Roberto Carlos',
        apellidos: 'Zamora León',
        cedula: '1750123480',
        fechaNacimiento: new Date('1998-05-12'),
        categoriaNombre: 'Adulto',
        disciplinaNombre: 'Fútbol',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Elena Patricia',
        apellidos: 'Mora Espinoza',
        cedula: '1750123481',
        fechaNacimiento: new Date('1999-09-08'),
        categoriaNombre: 'Adulto',
        disciplinaNombre: 'Natación',
        genero: Genero.FEMENINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Joaquín',
        apellidos: 'Sandoval Romero',
        cedula: '1750123482',
        fechaNacimiento: new Date('2008-11-15'),
        categoriaNombre: 'Infantil',
        disciplinaNombre: 'Atletismo',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Renata',
        apellidos: 'Suárez Córdova',
        cedula: '1750123483',
        fechaNacimiento: new Date('2009-07-21'),
        categoriaNombre: 'Infantil',
        disciplinaNombre: 'Ciclismo',
        genero: Genero.FEMENINO,
        afiliacion: false,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Bruno',
        apellidos: 'Herrera Ramos',
        cedula: '1750123484',
        fechaNacimiento: new Date('1997-02-18'),
        categoriaNombre: 'Adulto',
        disciplinaNombre: 'Ciclismo',
        genero: Genero.MASCULINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
      {
        nombres: 'Valeria',
        apellidos: 'Ibarra Molina',
        cedula: '1750123485',
        fechaNacimiento: new Date('2007-12-09'),
        categoriaNombre: 'Juvenil',
        disciplinaNombre: 'Fútbol',
        genero: Genero.FEMENINO,
        afiliacion: true,
        afiliacionInicio: now,
        afiliacionFin: fin,
      },
    ];

    for (const deportista of deportistas) {
      const disciplina = await this.prisma.disciplina.findFirst({
        where: { nombre: deportista.disciplinaNombre },
      });

      const categoria = await this.prisma.categoria.findFirst({
        where: { nombre: deportista.categoriaNombre },
      });

      if (!disciplina || !categoria) {
        this.logger.warn(
          `⚠️ No se encontró disciplina o categoría para deportista: ${deportista.nombres} ${deportista.apellidos}`,
        );
        continue;
      }

      await this.prisma.deportista.create({
        data: {
          nombres: deportista.nombres,
          apellidos: deportista.apellidos,
          cedula: deportista.cedula,
          fechaNacimiento: deportista.fechaNacimiento,
          categoriaId: categoria.id,
          disciplinaId: disciplina.id,
          afiliacion: deportista.afiliacion,
          afiliacionInicio: deportista.afiliacionInicio,
          afiliacionFin: deportista.afiliacionFin,
          genero: deportista.genero,
        },
      });
    }

    this.logger.log(`👟 ${deportistas.length} deportistas creados`);
  }

  async getDatabaseStatus() {
    try {
      const [
        categorias,
        disciplinas,
        rubros,
        roles,
        usuarios,
        usuarioRoles,
        eventos,
        deportistas,
      ] = await Promise.all([
        this.prisma.categoria.count(),
        this.prisma.disciplina.count(),
        this.prisma.rubro.count(),
        this.prisma.rol.count(),
        this.prisma.usuario.count(),
        this.prisma.usuarioRol.count(),
        this.prisma.evento.count(),
        this.prisma.deportista.count(),
      ]);

      return {
        categorias,
        disciplinas,
        rubros,
        roles,
        usuarios,
        usuarioRoles,
        eventos,
        deportistas,
        isEmpty:
          categorias === 0 &&
          disciplinas === 0 &&
          rubros === 0 &&
          roles === 0 &&
          usuarios === 0 &&
          eventos === 0 &&
          deportistas === 0,
      };
    } catch (error) {
      this.logger.error('Error obteniendo estado de la base de datos:', error);
      throw new Error('Error al obtener el estado de la base de datos');
    }
  }
}
