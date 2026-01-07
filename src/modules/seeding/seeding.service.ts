import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PasswordService } from '../../common/services/password/password.service';
import { categoriasSeed } from './data/categorias';
import { disciplinasSeed } from './data/disciplinas';
import { rubrosSeed } from './data/rubros';
import { rolesSeed } from './data/roles';
import { usuariosSeed } from './data/usuarios';
import { entrenadoresSeed } from './data/entrenadores';
import { eventosSeed } from './data/eventos';
import { deportistasSeed } from './data/deportistas';
import { actividadesSeed } from './data/actividades';
import { itemsSeed } from './data/items';

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
      // Crear actividades e items presupuestarios
      await this.createActividades();
      await this.createItems();
      // Crear eventos y asignarles items presupuestarios
      await this.createEventos();
      await this.createDeportistas();
      // Crear avales de ejemplo
      // TODO: Descomentar cuando se agreguen los métodos createAvales() y createAvalCompleto()
      // await this.createAvales();

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

      // PDA / Financiero / DTM related items
      this.prisma.pdaItem.deleteMany(),
      this.prisma.financieroItem.deleteMany(),

      // Main PDA/DTM/Financiero records
      this.prisma.pda.deleteMany(),
      this.prisma.dtm.deleteMany(),
      this.prisma.financiero.deleteMany(),

      // Aval (technical) related
      this.prisma.avalRequerimiento.deleteMany(),
      this.prisma.avalCriterio.deleteMany(),
      this.prisma.avalObjetivo.deleteMany(),
      this.prisma.avalTecnico.deleteMany(),

      // Colección and its relations
      this.prisma.coleccionEntrenador.deleteMany(),
      // Entrenadores (delete colecciones first above)
      this.prisma.entrenador.deleteMany(),
      this.prisma.historialColeccion.deleteMany(),
      this.prisma.coleccionAval.deleteMany(),

      // Deportistas (now safe to delete)
      this.prisma.deportista.deleteMany(),

      // Eventos y sus items presupuestarios
      this.prisma.eventoItem.deleteMany(),
      this.prisma.evento.deleteMany(),

      // Usuarios & roles
      this.prisma.usuarioRol.deleteMany(),
      this.prisma.usuario.deleteMany(),
      this.prisma.rol.deleteMany(),

      // Catalogs
      this.prisma.categoria.deleteMany(),
      this.prisma.disciplina.deleteMany(),
      this.prisma.rubro.deleteMany(),

      // Items presupuestarios y actividades
      this.prisma.item.deleteMany(),
      this.prisma.actividad.deleteMany(),
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
    await this.prisma
      .$executeRaw`ALTER SEQUENCE "Actividad_id_seq" RESTART WITH 1;`;
    await this.prisma
      .$executeRaw`ALTER SEQUENCE "Item_id_seq" RESTART WITH 1;`;
    await this.prisma
      .$executeRaw`ALTER SEQUENCE "EventoItem_id_seq" RESTART WITH 1;`;
    this.logger.log('🔄 Secuencias de autoincremento reseteadas');
  }

  private async createCategorias() {
    await this.prisma.categoria.createMany({
      data: categoriasSeed,
      skipDuplicates: true,
    });
    this.logger.log('?? Categorías creadas');
  }

  private async createDisciplinas() {
    await this.prisma.disciplina.createMany({
      data: disciplinasSeed,
      skipDuplicates: true,
    });
    this.logger.log('?? Disciplinas creadas');
  }

  private async createRubros() {
    await this.prisma.rubro.createMany({
      data: rubrosSeed,
      skipDuplicates: true,
    });
    this.logger.log('?? Rubros presupuestarios creados');
  }

  private async createRoles() {
    await this.prisma.rol.createMany({
      data: rolesSeed,
      skipDuplicates: true,
    });
    this.logger.log('?? Roles creados');
  }

  private async createUsuarios() {
    const hashedPassword = await this.passwordService.hashPassword('123456');

    const usuarios = usuariosSeed.map((user) => ({ ...user, password: hashedPassword }));

    const createdUsuarios = await this.prisma.$transaction(async (tx) => {
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

    this.logger.log(`?? ${createdUsuarios.length} usuarios creados con roles asignados`);
    return createdUsuarios;
  }

  private async createEntrenadores() {
    await this.prisma.entrenador.createMany({
      data: entrenadoresSeed,
      skipDuplicates: true,
    });

    this.logger.log(`🏋️ ${entrenadoresSeed.length} entrenadores seed creados`);
  }

  private async createActividades() {
    await this.prisma.actividad.createMany({
      data: actividadesSeed,
      skipDuplicates: true,
    });
    this.logger.log(`📂 ${actividadesSeed.length} actividades presupuestarias creadas`);
  }

  private async createItems() {
    for (const item of itemsSeed) {
      const actividad = await this.prisma.actividad.findFirst({
        where: { numero: item.actividadNumero },
      });

      if (!actividad) {
        this.logger.warn(`⚠️ No se encontró actividad con número ${item.actividadNumero} para item: ${item.nombre}`);
        continue;
      }

      await this.prisma.item.create({
        data: {
          actividadId: actividad.id,
          nombre: item.nombre,
          numero: item.numero,
          descripcion: item.descripcion,
        },
      });
    }
    this.logger.log(`📋 ${itemsSeed.length} items presupuestarios creados`);
  }

  private async createEventos() {
    // Obtener todos los items para asignar a eventos
    const allItems = await this.prisma.item.findMany();
    let eventoItemsCount = 0;

    for (const evento of eventosSeed) {
      const disciplina = await this.prisma.disciplina.findFirst({
        where: { nombre: evento.disciplinaNombre },
      });

      const categoria = await this.prisma.categoria.findFirst({
        where: { nombre: evento.categoriaNombre },
      });

      if (!disciplina || !categoria) {
        this.logger.warn(`⚠️ No se encontró disciplina o categoría para evento: ${evento.nombre}`);
        continue;
      }

      const createdEvento = await this.prisma.evento.create({
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

      // Asignar items presupuestarios aleatorios al evento
      // Seleccionamos entre 3 y 6 items aleatorios para cada evento
      const numItems = Math.floor(Math.random() * 4) + 3; // 3 a 6 items
      const shuffledItems = [...allItems].sort(() => Math.random() - 0.5);
      const selectedItems = shuffledItems.slice(0, Math.min(numItems, allItems.length));

      // Mes del evento basado en fechaInicio
      const eventoMonth = evento.fechaInicio.getMonth() + 1; // 1-12

      for (const item of selectedItems) {
        // Presupuesto aleatorio entre 500 y 5000
        const presupuesto = Math.floor(Math.random() * 4500) + 500;

        await this.prisma.eventoItem.create({
          data: {
            eventoId: createdEvento.id,
            itemId: item.id,
            mes: eventoMonth,
            presupuesto: presupuesto,
          },
        });
        eventoItemsCount++;
      }
    }

    this.logger.log(`🎯 ${eventosSeed.length} eventos creados con estados variados`);
    this.logger.log(`💰 ${eventoItemsCount} items presupuestarios asignados a eventos`);
  }

  private async createDeportistas() {
    for (const deportista of deportistasSeed) {
      const disciplina = await this.prisma.disciplina.findFirst({
        where: { nombre: deportista.disciplinaNombre },
      });

      const categoria = await this.prisma.categoria.findFirst({
        where: { nombre: deportista.categoriaNombre },
      });

      if (!disciplina || !categoria) {
        this.logger.warn(
          `?? No se encontró disciplina o categoría para deportista: ${deportista.nombres} ${deportista.apellidos}`,
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

    this.logger.log(`?? ${deportistasSeed.length} deportistas creados`);
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
        actividades,
        items,
        eventoItems,
      ] = await Promise.all([
        this.prisma.categoria.count(),
        this.prisma.disciplina.count(),
        this.prisma.rubro.count(),
        this.prisma.rol.count(),
        this.prisma.usuario.count(),
        this.prisma.usuarioRol.count(),
        this.prisma.evento.count(),
        this.prisma.deportista.count(),
        this.prisma.actividad.count(),
        this.prisma.item.count(),
        this.prisma.eventoItem.count(),
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
        actividades,
        items,
        eventoItems,
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
