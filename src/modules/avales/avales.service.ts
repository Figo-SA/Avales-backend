import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageService } from 'src/common/services/storage/storage.service';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { PrinterService } from '../reports/printer/printer.service';
import { PaginationHelper } from 'src/common/herlpers/pagination.helper';
import { PaginationMetaDto } from 'src/common/dtos/pagination-meta.dto';
import { Estado, EtapaFlujo } from '@prisma/client';
import { CreateAvalDto } from './dto/create-aval.dto';
import { AvalQueryDto } from './dto/aval-query.dto';
import { AvalResponseDto, HistorialResponseDto } from './dto/aval-response.dto';
import {
  AvalNotFoundException,
  EventoNotFoundException,
  EventoNotAvailableException,
  AvalAlreadyExistsException,
  AvalInvalidStateException,
  EntrenadorNotFoundException,
} from './exceptions/avales.exceptions';
import { solicitudAvalReport } from '../reports/reports/solicitud-aval.report';
import { certificacionPdaReport } from '../reports/reports/certificacion-pda.report';
import { avalCompletoReport } from '../reports/reports/aval-completo.report';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class AvalesService {
  private readonly avalInclude = {
    evento: {
      include: {
        disciplina: true,
        categoria: true,
      },
    },
    avalTecnico: {
      where: { deleted: false },
      include: {
        objetivos: { orderBy: { orden: 'asc' as const } },
        criterios: { orderBy: { orden: 'asc' as const } },
        requerimientos: {
          include: { rubro: true },
        },
        deportistasAval: {
          include: {
            deportista: true,
          },
        },
      },
    },
    entrenadores: {
      include: {
        entrenador: true,
      },
    },
    historial: {
      include: {
        usuario: true,
      },
      orderBy: { createdAt: 'desc' as const },
    },
  };

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private pushNotificationsService: PushNotificationsService,
    private printerService: PrinterService,
  ) {}

  /**
   * Listar avales con paginación y filtros
   */
  async findAll(query: AvalQueryDto): Promise<{
    items: AvalResponseDto[];
    pagination: PaginationMetaDto;
  }> {
    const { page = 1, limit = 50, estado, etapa, eventoId, search } = query;

    const where: any = {};

    if (estado) {
      where.estado = estado;
    }

    if (eventoId) {
      where.eventoId = eventoId;
    }

    // Filtrar por etapa en el historial (última etapa)
    if (etapa) {
      where.historial = {
        some: { etapa },
      };
    }

    // Búsqueda por nombre o código del evento
    if (search) {
      where.evento = {
        OR: [
          { nombre: { contains: search, mode: 'insensitive' } },
          { codigo: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.coleccionAval.count({ where }),
      this.prisma.coleccionAval.findMany({
        where,
        include: this.avalInclude,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const pagination = PaginationHelper.buildMeta(total, page, limit);

    return {
      items: items.map((item) => this.mapToResponse(item)),
      pagination,
    };
  }

  /**
   * Obtener un aval por ID
   */
  async findOne(id: number): Promise<AvalResponseDto> {
    const aval = await this.prisma.coleccionAval.findUnique({
      where: { id },
      include: this.avalInclude,
    });

    if (!aval) {
      throw new AvalNotFoundException();
    }

    return this.mapToResponse(aval);
  }

  /**
   * Obtener avales de un evento
   */
  async findByEvento(eventoId: number): Promise<AvalResponseDto[]> {
    const avales = await this.prisma.coleccionAval.findMany({
      where: { eventoId },
      include: this.avalInclude,
      orderBy: { createdAt: 'desc' },
    });

    return avales.map((aval) => this.mapToResponse(aval));
  }

  /**
   * Obtener historial de un aval
   */
  async findHistorial(id: number): Promise<HistorialResponseDto[]> {
    const aval = await this.prisma.coleccionAval.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!aval) {
      throw new AvalNotFoundException();
    }

    const historial = await this.prisma.historialColeccion.findMany({
      where: { coleccionAvalId: id },
      include: {
        usuario: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return historial.map((h) => ({
      id: h.id,
      estado: h.estado,
      etapa: h.etapa,
      comentario: h.comentario ?? undefined,
      usuario: {
        id: h.usuario.id,
        nombre: `${h.usuario.nombre} ${h.usuario.apellido}`,
        email: h.usuario.email,
      },
      createdAt: h.createdAt.toISOString(),
    }));
  }

  /**
   * PASO 1: Subir convocatoria y crear ColeccionAval
   */
  async uploadConvocatoria(
    eventoId: number,
    convocatoriaFile: Express.Multer.File,
  ): Promise<AvalResponseDto> {
    // Verificar que el evento existe y está disponible
    const evento = await this.prisma.evento.findFirst({
      where: { id: eventoId, deleted: false },
    });

    if (!evento) {
      throw new EventoNotFoundException();
    }

    if (evento.estado !== Estado.DISPONIBLE) {
      throw new EventoNotAvailableException(evento.estado);
    }

    // Verificar que no exista un aval previo
    const avalExistente = await this.prisma.coleccionAval.findFirst({
      where: { eventoId },
    });

    if (avalExistente) {
      throw new AvalAlreadyExistsException();
    }

    // Subir archivo de convocatoria
    const convocatoriaUrl = await this.storageService.uploadFile(
      convocatoriaFile,
      'avales/convocatorias',
    );

    // Crear descripción automática
    const descripcion = `Solicitud de aval para ${evento.nombre} - ${evento.lugar}, ${evento.ciudad}`;

    // Crear ColeccionAval con la convocatoria (sin AvalTecnico todavía)
    const coleccion = await this.prisma.coleccionAval.create({
      data: {
        descripcion,
        eventoId,
        estado: Estado.BORRADOR, // Convocatoria subida, esperando AvalTecnico
        convocatoriaUrl,
      } as any,
    });

    // Retornar la colección creada
    return this.findOne(coleccion.id);
  }

  /**
   * PASO 2: Crear solicitud de aval técnico
   */
  async create(createAvalDto: CreateAvalDto): Promise<AvalResponseDto> {
    const { coleccionAvalId, entrenadores, deportistas, rubros, ...solicitudData } =
      createAvalDto;

    // Verificar que la ColeccionAval existe
    const coleccion = await this.prisma.coleccionAval.findUnique({
      where: { id: coleccionAvalId },
      include: {
        evento: true,
        avalTecnico: true,
      },
    });

    if (!coleccion) {
      throw new AvalNotFoundException();
    }

    // Verificar que no tenga ya un AvalTecnico activo (no eliminado)
    if (coleccion.avalTecnico && !coleccion.avalTecnico.deleted) {
      throw new BadRequestException(
        'Esta colección de aval ya tiene un AvalTecnico activo',
      );
    }

    const evento = coleccion.evento;

    // Calcular totales
    const totalEntrenadores = entrenadores.length;
    const totalDeportistas = deportistas.length;

    // Validar que el número de deportistas coincida con el evento
    const totalDeportistasEvento = evento.numAtletasHombres + evento.numAtletasMujeres;
    if (totalDeportistas !== totalDeportistasEvento) {
      throw new BadRequestException(
        `El número de deportistas (${totalDeportistas}) no coincide con el evento (${totalDeportistasEvento}). ` +
        `Evento requiere: ${evento.numAtletasHombres} hombres + ${evento.numAtletasMujeres} mujeres = ${totalDeportistasEvento} total.`
      );
    }

    // Crear descripción automática
    const descripcion = `Solicitud de aval para ${evento.nombre} - ${evento.lugar}, ${evento.ciudad}`;

    // Crear todo en una transacción
    const resultado = await this.prisma.$transaction(async (tx) => {
      // 1. Crear AvalTecnico (solicitud)
      const avalTecnico = await tx.avalTecnico.create({
        data: {
          coleccionAvalId,
          descripcion,
          fechaHoraSalida: new Date(solicitudData.fechaHoraSalida),
          fechaHoraRetorno: new Date(solicitudData.fechaHoraRetorno),
          transporteSalida: solicitudData.transporteSalida,
          transporteRetorno: solicitudData.transporteRetorno,
          entrenadores: totalEntrenadores,
          atletas: totalDeportistas,
          observaciones: solicitudData.observaciones,
        },
      });

      // 2. Crear objetivos
      if (solicitudData.objetivos && solicitudData.objetivos.length > 0) {
        await tx.avalObjetivo.createMany({
          data: solicitudData.objetivos.map((obj) => ({
            avalTecnicoId: avalTecnico.id,
            orden: obj.orden,
            descripcion: obj.descripcion,
          })),
        });
      }

      // 3. Crear criterios
      if (solicitudData.criterios && solicitudData.criterios.length > 0) {
        await tx.avalCriterio.createMany({
          data: solicitudData.criterios.map((crit) => ({
            avalTecnicoId: avalTecnico.id,
            orden: crit.orden,
            descripcion: crit.descripcion,
          })),
        });
      }

      // 4. Crear rubros presupuestarios
      if (rubros && rubros.length > 0) {
        await tx.avalRequerimiento.createMany({
          data: rubros.map((rubro) => ({
            avalTecnicoId: avalTecnico.id,
            rubroId: rubro.rubroId,
            cantidadDias: rubro.cantidadDias,
            valorUnitario: rubro.valorUnitario,
          })),
        });
      }

      // 5. Crear deportistas del aval
      if (deportistas && deportistas.length > 0) {
        await tx.deportistaAval.createMany({
          data: deportistas.map((dep) => ({
            avalTecnicoId: avalTecnico.id,
            deportistaId: dep.deportistaId,
            rol: dep.rol,
          })),
        });
      }

      // 6. Crear entrenadores de la colección
      if (entrenadores && entrenadores.length > 0) {
        // Validar que los entrenadores existen
        const entrenadorIds = entrenadores.map((ent) => ent.entrenadorId);
        const entrenadoresExistentes = await tx.entrenador.findMany({
          where: { id: { in: entrenadorIds } },
          select: { id: true },
        });

        const existentesIds = entrenadoresExistentes.map((e) => e.id);
        const faltantes = entrenadorIds.filter(
          (id) => !existentesIds.includes(id),
        );

        if (faltantes.length > 0) {
          throw new EntrenadorNotFoundException(faltantes[0]);
        }

        await tx.coleccionEntrenador.createMany({
          data: entrenadores.map((ent) => ({
            coleccionAvalId,
            entrenadorId: ent.entrenadorId,
            rol: ent.rol,
            esPrincipal: ent.esPrincipal ?? false,
          })),
        });
      }

      // 7. Actualizar la ColeccionAval a estado SOLICITADO
      await tx.coleccionAval.update({
        where: { id: coleccionAvalId },
        data: { estado: Estado.SOLICITADO },
      });

      // 8. Actualizar estado del evento a SOLICITADO
      await tx.evento.update({
        where: { id: evento.id },
        data: { estado: Estado.SOLICITADO },
      });

      // 9. Crear registro en el historial
      await tx.historialColeccion.create({
        data: {
          coleccionAvalId,
          estado: Estado.SOLICITADO,
          etapa: EtapaFlujo.SOLICITUD,
          usuarioId: 1, // TODO: Obtener del usuario actual
          comentario: 'Solicitud de aval creada',
        },
      });

      return coleccionAvalId;
    });

    // TODO: Generar PDF DTM automáticamente y notificar usuarios

    return this.findOne(resultado);
  }

  /**
   * Subir archivo del aval
   */
  async uploadArchivo(
    id: number,
    archivo: Express.Multer.File,
  ): Promise<AvalResponseDto> {
    const aval = await this.prisma.coleccionAval.findUnique({
      where: { id },
    });

    if (!aval) {
      throw new AvalNotFoundException();
    }

    const archivoUrl = await this.storageService.uploadFile(archivo, 'avales');

    await this.prisma.coleccionAval.update({
      where: { id },
      data: { aval: archivoUrl } as any,
    });

    return this.findOne(id);
  }

  /**
   * Aprobar solicitud de aval
   */
  async aprobar(id: number, usuarioId: number): Promise<AvalResponseDto> {
    const aval = await this.prisma.coleccionAval.findUnique({
      where: { id },
      include: { evento: true },
    });

    if (!aval) {
      throw new AvalNotFoundException();
    }

    if (aval.estado !== Estado.SOLICITADO) {
      throw new AvalInvalidStateException(
        'aprobar',
        aval.estado,
        [Estado.SOLICITADO],
      );
    }

    await this.prisma.$transaction([
      // Actualizar estado del aval
      this.prisma.coleccionAval.update({
        where: { id },
        data: { estado: Estado.ACEPTADO } as any,
      }),
      // Actualizar estado del evento
      this.prisma.evento.update({
        where: { id: aval.eventoId },
        data: { estado: Estado.ACEPTADO },
      }),
      // Registrar en historial
      this.prisma.historialColeccion.create({
        data: {
          coleccionAvalId: id,
          usuarioId,
          estado: Estado.ACEPTADO,
          etapa: EtapaFlujo.REVISION_DTM,
        },
      }),
    ]);

    // TODO: Notificar entrenadores y generar PDF completo

    return this.findOne(id);
  }

  /**
   * Rechazar solicitud de aval
   */
  async rechazar(
    id: number,
    usuarioId: number,
    motivo?: string,
  ): Promise<AvalResponseDto> {
    const aval = await this.prisma.coleccionAval.findUnique({
      where: { id },
      include: { evento: true },
    });

    if (!aval) {
      throw new AvalNotFoundException();
    }

    if (aval.estado !== Estado.SOLICITADO) {
      throw new AvalInvalidStateException(
        'rechazar',
        aval.estado,
        [Estado.SOLICITADO],
      );
    }

    await this.prisma.$transaction([
      // Actualizar estado del aval
      this.prisma.coleccionAval.update({
        where: { id },
        data: {
          estado: Estado.RECHAZADO,
          comentario: motivo,
        } as any,
      }),
      // Actualizar estado del evento
      this.prisma.evento.update({
        where: { id: aval.eventoId },
        data: { estado: Estado.RECHAZADO },
      }),
      // Registrar en historial
      this.prisma.historialColeccion.create({
        data: {
          coleccionAvalId: id,
          usuarioId,
          estado: Estado.RECHAZADO,
          etapa: EtapaFlujo.REVISION_DTM,
          comentario: motivo,
        },
      }),
    ]);

    // TODO: Notificar entrenadores

    return this.findOne(id);
  }

  /**
   * Generar PDF DTM
   */
  async generateDtmPdf(id: number): Promise<{ buffer: Buffer; archivoUrl?: string }> {
    const aval = await this.prisma.coleccionAval.findUnique({
      where: { id },
      include: {
        evento: {
          include: {
            disciplina: true,
            categoria: true,
          },
        },
        avalTecnico: {
          include: {
            objetivos: { orderBy: { orden: 'asc' } },
            criterios: { orderBy: { orden: 'asc' } },
            requerimientos: {
              include: { rubro: true },
            },
            deportistasAval: {
              include: { deportista: true },
            },
          },
        },
        entrenadores: {
          include: { entrenador: true },
        },
      },
    });

    if (!aval) {
      throw new AvalNotFoundException();
    }

    const reportData: any = {
      codigo: aval.evento.codigo,
      disciplina: aval.evento.disciplina?.nombre ?? '',
      categoria: aval.evento.categoria?.nombre ?? '',
      genero: aval.evento.genero,
      nombre: aval.evento.nombre,
      lugar: aval.evento.lugar,
      fechaInicio: aval.evento.fechaInicio,
      fechaFin: aval.evento.fechaFin,
      fechaHoraSalida: aval.avalTecnico?.fechaHoraSalida,
      fechaHoraRetorno: aval.avalTecnico?.fechaHoraRetorno,
      transporteSalida: aval.avalTecnico?.transporteSalida,
      transporteRetorno: aval.avalTecnico?.transporteRetorno,
      objetivos: aval.avalTecnico?.objetivos.map((o) => o.descripcion) ?? [],
      criterios: aval.avalTecnico?.criterios.map((c) => c.descripcion) ?? [],
      requerimientos: aval.avalTecnico?.requerimientos.map((r) => ({
        rubro: r.rubro.nombre,
        cantidadDias: r.cantidadDias,
        valorUnitario: r.valorUnitario?.toString(),
      })) ?? [],
      deportistas: aval.avalTecnico?.deportistasAval.map((d) => ({
        nombres: d.deportista.nombres,
        apellidos: d.deportista.apellidos,
        cedula: d.deportista.cedula,
      })) ?? [],
      entrenadores: aval.entrenadores.map((e) => ({
        nombres: e.entrenador.nombres,
        apellidos: e.entrenador.apellidos,
        cedula: e.entrenador.cedula,
        rol: e.rol,
      })),
    };

    const docDefinition = solicitudAvalReport(reportData);
    const pdfDoc = this.printerService.createPdf(docDefinition);

    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });

    return { buffer: pdfBuffer };
  }

  /**
   * Generar PDF PDA
   */
  async generatePdaPdf(id: number): Promise<{ buffer: Buffer }> {
    const aval = await this.prisma.coleccionAval.findUnique({
      where: { id },
      include: {
        evento: {
          include: {
            disciplina: true,
            categoria: true,
          },
        },
      },
    });

    if (!aval) {
      throw new AvalNotFoundException();
    }

    const reportData: any = {
      codigo: aval.evento.codigo,
      disciplina: aval.evento.disciplina?.nombre ?? '',
      categoria: aval.evento.categoria?.nombre ?? '',
      nombre: aval.evento.nombre,
      lugar: aval.evento.lugar,
      fechaInicio: aval.evento.fechaInicio,
      fechaFin: aval.evento.fechaFin,
    };

    const docDefinition = certificacionPdaReport(reportData);
    const pdfDoc = this.printerService.createPdf(docDefinition);

    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);
      pdfDoc.end();
    });

    return { buffer: pdfBuffer };
  }

  /**
   * Mapear entidad de Prisma a DTO de respuesta
   */
  private mapToResponse(aval: any): AvalResponseDto {
    return {
      id: aval.id,
      descripcion: aval.descripcion ?? undefined,
      estado: aval.estado,
      comentario: aval.comentario ?? undefined,
      convocatoriaUrl: aval.convocatoriaUrl ?? undefined,
      dtmUrl: aval.dtmUrl ?? undefined,
      pdaUrl: aval.pdaUrl ?? undefined,
      solicitudUrl: aval.solicitudUrl ?? undefined,
      aval: aval.aval ?? undefined,
      evento: {
        id: aval.evento.id,
        codigo: aval.evento.codigo,
        nombre: aval.evento.nombre,
        fechaInicio: aval.evento.fechaInicio.toISOString(),
        fechaFin: aval.evento.fechaFin.toISOString(),
        ciudad: aval.evento.ciudad,
        pais: aval.evento.pais,
      },
      avalTecnico: aval.avalTecnico ? {
        id: aval.avalTecnico.id,
        descripcion: aval.avalTecnico.descripcion ?? undefined,
        archivo: aval.avalTecnico.archivo ?? undefined,
        fechaHoraSalida: aval.avalTecnico.fechaHoraSalida.toISOString(),
        fechaHoraRetorno: aval.avalTecnico.fechaHoraRetorno.toISOString(),
        transporteSalida: aval.avalTecnico.transporteSalida,
        transporteRetorno: aval.avalTecnico.transporteRetorno,
        entrenadores: aval.avalTecnico.entrenadores,
        atletas: aval.avalTecnico.atletas,
        observaciones: aval.avalTecnico.observaciones ?? undefined,
        objetivos: aval.avalTecnico.objetivos?.map((o: any) => ({
          id: o.id,
          orden: o.orden,
          descripcion: o.descripcion,
        })) ?? [],
        criterios: aval.avalTecnico.criterios?.map((c: any) => ({
          id: c.id,
          orden: c.orden,
          descripcion: c.descripcion,
        })) ?? [],
        requerimientos: aval.avalTecnico.requerimientos?.map((r: any) => ({
          id: r.id,
          cantidadDias: r.cantidadDias,
          valorUnitario: r.valorUnitario?.toString(),
          rubro: {
            id: r.rubro.id,
            nombre: r.rubro.nombre,
          },
        })) ?? [],
        deportistasAval: aval.avalTecnico.deportistasAval?.map((d: any) => ({
          id: d.id,
          rol: d.rol,
          deportista: {
            id: d.deportista.id,
            nombre: `${d.deportista.nombres} ${d.deportista.apellidos}`,
            cedula: d.deportista.cedula,
          },
        })) ?? [],
      } : undefined,
      entrenadores: aval.entrenadores?.map((e: any) => ({
        id: e.id,
        rol: e.rol,
        esPrincipal: e.esPrincipal,
        entrenador: {
          id: e.entrenador.id,
          nombre: `${e.entrenador.nombres} ${e.entrenador.apellidos}`,
          email: e.entrenador.email,
        },
      })) ?? [],
      historial: aval.historial?.map((h: any) => ({
        id: h.id,
        estado: h.estado,
        etapa: h.etapa,
        comentario: h.comentario ?? undefined,
        usuario: {
          id: h.usuario.id,
          nombre: `${h.usuario.nombre} ${h.usuario.apellido}`,
          email: h.usuario.email,
        },
        createdAt: h.createdAt.toISOString(),
      })) ?? [],
      createdAt: aval.createdAt.toISOString(),
      updatedAt: aval.updatedAt.toISOString(),
    };
  }
}
