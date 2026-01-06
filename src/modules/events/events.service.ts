import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationHelper } from 'src/common/herlpers/pagination.helper';
import { PaginationMetaDto } from 'src/common/dtos/pagination-meta.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { Estado } from '@prisma/client';
import { StorageService } from 'src/common/services/storage/storage.service';
import { PushNotificationsService } from '../push-notifications/push-notifications.service';
import { PrinterService } from '../reports/printer/printer.service';
import { solicitudAvalReport } from '../reports/reports/solicitud-aval.report';
import { certificacionPdaReport } from '../reports/reports/certificacion-pda.report';
import { CreateSolicitudAvalDto } from './dto/create-solicitud-aval.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class EventsService {
  private readonly eventInclude = {
    disciplina: true,
    categoria: true,
    eventoItems: {
      include: {
        item: {
          include: {
            actividad: true,
          },
        },
      },
      orderBy: { mes: 'asc' as const },
    },
  };

  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private pushNotificationsService: PushNotificationsService,
    private printerService: PrinterService,
  ) {}

  async create(createEventDto: CreateEventDto, archivo?: Express.Multer.File) {
    let archivoUrl: string | undefined;

    if (archivo) {
      archivoUrl = await this.storageService.uploadFile(archivo, 'eventos');
    }

    const data = {
      ...createEventDto,
      fechaInicio: new Date(createEventDto.fechaInicio),
      fechaFin: new Date(createEventDto.fechaFin),
      archivo: archivoUrl,
    };

    return this.prisma.evento.create({
      data,
      include: this.eventInclude,
    });
  }

  async findAllPaginated(
    page: number,
    limit: number,
    estado?: Estado,
    search?: string,
  ): Promise<{
    items: EventResponseDto[];
    pagination: PaginationMetaDto;
  }> {
    const { skip, take } = PaginationHelper.buildPagination(page, limit);

    const where: any = { deleted: false };

    if (estado) {
      where.estado = estado;
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { codigo: { contains: search, mode: 'insensitive' } },
        { lugar: { contains: search, mode: 'insensitive' } },
        { ciudad: { contains: search, mode: 'insensitive' } },
        { provincia: { contains: search, mode: 'insensitive' } },
        { tipoEvento: { contains: search, mode: 'insensitive' } },
        { alcance: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, eventos] = await this.prisma.$transaction([
      this.prisma.evento.count({ where }),
      this.prisma.evento.findMany({
        skip,
        take,
        where,
        include: this.eventInclude,
        orderBy: {
          updatedAt: 'desc',
        },
      }),
    ]);

    return PaginationHelper.buildPaginatedResponse(eventos, total, page, limit);
  }

  async findAll() {
    return await this.prisma.evento.findMany({
      where: { deleted: false },
      include: this.eventInclude,
      orderBy: {
        fechaInicio: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return await this.prisma.evento.findFirst({
      where: { id, deleted: false },
      include: this.eventInclude,
    });
  }

  async updateEvent(id: number, updateEventDto: UpdateEventDto) {
    const evento = await this.prisma.evento.findUnique({ where: { id } });
    if (!evento || evento.deleted) {
      throw new NotFoundException(`Evento con id ${id} no encontrado`);
    }

    const data: Record<string, any> = {};
    Object.entries(updateEventDto).forEach(([key, value]) => {
      if (value !== undefined) {
        data[key] = value;
      }
    });

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No se proporcionaron campos para actualizar');
    }

    if (data.fechaInicio) {
      data.fechaInicio = new Date(data.fechaInicio as string);
    }

    if (data.fechaFin) {
      data.fechaFin = new Date(data.fechaFin as string);
    }

    return await this.prisma.evento.update({
      where: { id },
      data,
      include: this.eventInclude,
    });
  }

  async softDeleteEvent(id: number) {
    const evento = await this.prisma.evento.findUnique({ where: { id } });
    if (!evento) {
      throw new NotFoundException(`Evento con id ${id} no encontrado`);
    }

    if (evento.deleted) {
      throw new BadRequestException(`Evento con id ${id} ya está eliminado`);
    }

    return this.prisma.evento.update({
      where: { id },
      data: { deleted: true },
      include: this.eventInclude,
    });
  }

  async restoreEvent(id: number) {
    const evento = await this.prisma.evento.findUnique({ where: { id } });
    if (!evento) {
      throw new NotFoundException(`Evento con id ${id} no encontrado`);
    }

    if (!evento.deleted) {
      throw new BadRequestException(`Evento con id ${id} no está eliminado`);
    }

    return this.prisma.evento.update({
      where: { id },
      data: { deleted: false },
      include: this.eventInclude,
    });
  }

  /**
   * Obtener la colección de aval asociada a un evento con sus entidades relacionadas
   * (AvalTecnico con objetivos/criterios/requerimientos/deportistas, PDA, DTM, entrenadores)
   */
  async getColeccionByEventoId(id: number) {
    const coleccion = await this.prisma.coleccionAval.findFirst({
      where: { eventoId: id },
      include: {
        evento: true,
        avalTecnico: {
          include: {
            objetivos: true,
            criterios: true,
            requerimientos: true,
            deportistasAval: { include: { deportista: true } },
          },
        },
        pda: true,
        dtm: true,
        entrenadores: { include: { entrenador: true } },
        financiero: true,
      },
    });

    if (!coleccion) {
      throw new Error(`ColeccionAval para evento ${id} no encontrada`);
    }

    return coleccion;
  }

  /**
   * Listar colecciones de aval paginadas para revisión
   */
  async findColeccionesPaginated(
    page: number,
    limit: number,
    estado?: Estado,
    search?: string,
  ): Promise<{ items: any[]; pagination: PaginationMetaDto }> {
    const { skip, take } = PaginationHelper.buildPagination(page, limit);

    const where: any = {};
    if (estado) where.estado = estado;

    if (search) {
      where.OR = [
        { descripcion: { contains: search, mode: 'insensitive' } },
        { evento: { nombre: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [total, items] = await this.prisma.$transaction([
      this.prisma.coleccionAval.count({ where }),
      this.prisma.coleccionAval.findMany({
        where,
        skip,
        take,
        include: {
          evento: true,
          avalTecnico: {
            include: {
              objetivos: true,
              criterios: true,
              requerimientos: true,
              deportistasAval: { include: { deportista: true } },
            },
          },
          pda: true,
          dtm: true,
          entrenadores: { include: { entrenador: true } },
          financiero: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return PaginationHelper.buildPaginatedResponse(items, total, page, limit);
  }

  async createAval(
    id: number,
    solicitudData: CreateSolicitudAvalDto,
    solicitudFile?: Express.Multer.File,
  ) {
    // Verificar que el evento existe y está disponible
    const evento = await this.prisma.evento.findFirst({
      where: { id, deleted: false },
    });

    if (!evento) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }

    if (evento.estado !== Estado.DISPONIBLE) {
      throw new Error(
        `El evento no está disponible para solicitudes. Estado actual: ${evento.estado}`,
      );
    }

    // Calcular totales automáticamente
    const totalEntrenadores = solicitudData.entrenadores.length;
    const totalDeportistas = solicitudData.deportistas.length;

    // Crear descripción automática basada en el evento
    const descripcion = `Solicitud de aval para ${evento.nombre} - ${evento.lugar}, ${evento.ciudad}`;

    // Subir archivo de solicitud si fue enviado por el usuario (antes de la transacción)
    let solicitudUrl: string | undefined;
    if (solicitudFile) {
      try {
        solicitudUrl = await this.storageService.uploadFile(
          solicitudFile,
          'avales',
        );
      } catch (err) {
        console.error('Error subiendo archivo de solicitud:', err);
      }
    }

    // Crear todo en una transacción
    const resultado = await this.prisma.$transaction(async (tx) => {
      // 1. Crear ColeccionAval
      const coleccion = await tx.coleccionAval.create({
        data: {
          descripcion,
          eventoId: id,
          solicitudUrl,
          estado: Estado.SOLICITADO,
        } as any,
      });

      // 2. Crear AvalTecnico sin archivo (se sube después)
      const avalTecnico = await tx.avalTecnico.create({
        data: {
          coleccionAvalId: coleccion.id,
          descripcion,
          // Archivo se sube después con uploadAvalArchivo
          // Usar las fechas de la solicitud
          fechaHoraSalida: new Date(solicitudData.fechaHoraSalida),
          fechaHoraRetorno: new Date(solicitudData.fechaHoraRetorno),
          // Transporte de la solicitud
          transporteSalida: solicitudData.transporteSalida,
          transporteRetorno: solicitudData.transporteRetorno,
          // Totales calculados automáticamente
          entrenadores: totalEntrenadores,
          atletas: totalDeportistas,
          observaciones: solicitudData.observaciones,
        },
      });

      // 3. Crear objetivos
      if (solicitudData.objetivos && solicitudData.objetivos.length > 0) {
        await tx.avalObjetivo.createMany({
          data: solicitudData.objetivos.map((obj) => ({
            avalTecnicoId: avalTecnico.id,
            orden: obj.orden,
            descripcion: obj.descripcion,
          })),
        });
      }

      // 4. Crear criterios
      if (solicitudData.criterios && solicitudData.criterios.length > 0) {
        await tx.avalCriterio.createMany({
          data: solicitudData.criterios.map((crit) => ({
            avalTecnicoId: avalTecnico.id,
            orden: crit.orden,
            descripcion: crit.descripcion,
          })),
        });
      }

      // 5. Crear rubros presupuestarios
      if (solicitudData.rubros && solicitudData.rubros.length > 0) {
        await tx.avalRequerimiento.createMany({
          data: solicitudData.rubros.map((rubro) => ({
            avalTecnicoId: avalTecnico.id,
            rubroId: rubro.rubroId,
            cantidadDias: rubro.cantidadDias,
            valorUnitario: rubro.valorUnitario,
          })),
        });
      }

      // 6. Crear deportistas del aval
      if (solicitudData.deportistas && solicitudData.deportistas.length > 0) {
        await tx.deportistaAval.createMany({
          data: solicitudData.deportistas.map((dep) => ({
            avalTecnicoId: avalTecnico.id,
            deportistaId: dep.deportistaId,
            rol: dep.rol,
          })),
        });
      }

      // 7. Crear entrenadores de la colección
      if (solicitudData.entrenadores && solicitudData.entrenadores.length > 0) {
        // Validar que los entrenadores existen (tabla Entrenador) para evitar violaciones de FK
        const entrenadorIds = solicitudData.entrenadores.map(
          (ent) => ent.entrenadorId,
        );
        const entrenadoresExistentes = await tx.entrenador.findMany({
          where: { id: { in: entrenadorIds } },
          select: { id: true },
        });

        const existentesIds = entrenadoresExistentes.map((u) => u.id);
        const faltantes = entrenadorIds.filter(
          (id) => !existentesIds.includes(id),
        );

        if (faltantes.length > 0) {
          throw new BadRequestException(
            `Entrenadores no encontrados: ${faltantes.join(', ')}`,
          );
        }

        await tx.coleccionEntrenador.createMany({
          data: solicitudData.entrenadores.map((ent) => ({
            coleccionAvalId: coleccion.id,
            entrenadorId: ent.entrenadorId,
            rol: ent.rol,
            esPrincipal: ent.esPrincipal ?? false,
          })),
        });
      }

      // 8. Actualizar estado del evento a SOLICITADO
      const eventoActualizado = await tx.evento.update({
        where: { id },
        data: { estado: Estado.SOLICITADO },
        include: {
          disciplina: true,
          categoria: true,
        },
      });

      return {
        evento: eventoActualizado,
        coleccion,
        avalTecnico,
        resumen: {
          totalEntrenadores,
          totalDeportistas,
          descripcion,
        },
      };
    });

    // Adjuntar la solicitudUrl al resultado devuelto para que el caller la vea
    if (solicitudUrl) {
      try {
        (resultado.coleccion as any).solicitudUrl = solicitudUrl;
      } catch (err) {
        // noop
      }
    }

    // Notificar a usuarios DTM/PDA
    // Generar PDF de la solicitud automáticamente y subirlo al storage
    try {
      const genResult = await this.generateDtmPdf(id);

      const pdfBuffer = genResult.buffer;
      const archivoUrl = genResult.archivoUrl;

      // Si la generación devolvió una URL (upload realizada dentro del generador),
      // la base de datos ya fue actualizada desde generateDtmPdf. Si no, intentamos
      // subir el buffer aquí y actualizar la fila correspondiente.
      if (!archivoUrl && pdfBuffer) {
        const pdfFile: Express.Multer.File = {
          buffer: pdfBuffer,
          originalname: `aval-dtm-${id}.pdf`,
          mimetype: 'application/pdf',
          size: pdfBuffer.length,
          fieldname: 'archivo',
          encoding: '7bit',
          destination: '',
          filename: `aval-dtm-${id}.pdf`,
          path: '',
        } as any;

        const uploadedUrl = await this.storageService.uploadFile(
          pdfFile,
          'avales',
        );

        await this.prisma.avalTecnico.update({
          where: { id: resultado.avalTecnico.id },
          data: { archivo: uploadedUrl },
        });

        (resultado.avalTecnico as any).archivo = uploadedUrl;

        // Guardar también la URL del DTM en la colección
        try {
          await this.prisma.coleccionAval.update({
            where: { id: resultado.coleccion.id },
            data: { dtmUrl: uploadedUrl } as any,
          });
          (resultado.coleccion as any).dtmUrl = uploadedUrl;
        } catch (err) {
          console.error('Error guardando dtmUrl en la colección:', err);
        }
      } else if (archivoUrl) {
        // Si generateDtmPdf ya guardó la URL, adjuntarla al resultado
        (resultado.avalTecnico as any).archivo = archivoUrl;
        try {
          (resultado.coleccion as any).dtmUrl = archivoUrl;
        } catch (err) {
          // noop
        }
      }
    } catch (error) {
      // No detener la creación si la generación o subida falla, pero loguear el error
      console.error('Error generando/subiendo PDF de aval:', error);
    }

    // Intentar generar también el PDA automáticamente
    try {
      const pdaGen = await this.generatePdaPdf(id);
      const pdaUrl = pdaGen.archivoUrl;
      if (pdaUrl) {
        try {
          (resultado.coleccion as any).pdaUrl = pdaUrl;
        } catch (err) {
          // noop
        }
      }
    } catch (err) {
      console.error('Error generando/subiendo PDF PDA automáticamente:', err);
    }

    await this.notifyDTMUsers(resultado.evento.nombre);

    return resultado;
  }

  async uploadAvalArchivo(id: number, archivo: Express.Multer.File) {
    // Verificar que el evento existe y está en estado SOLICITADO
    const evento = await this.prisma.evento.findFirst({
      where: { id, deleted: false },
      include: {
        colecciones: {
          include: {
            avalTecnico: true,
          },
        },
      },
    });

    if (!evento) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }

    if (evento.estado !== Estado.SOLICITADO) {
      throw new Error(
        `El evento debe estar en estado SOLICITADO para subir archivo. Estado actual: ${evento.estado}`,
      );
    }

    // Obtener el aval técnico
    const coleccion = evento.colecciones[0];
    if (!coleccion?.avalTecnico) {
      throw new Error(
        'No existe una solicitud de aval para este evento. Primero cree la solicitud.',
      );
    }

    // Subir el archivo
    const archivoUrl = await this.storageService.uploadFile(archivo, 'avales');

    // Actualizar el AvalTecnico con el archivo
    const avalTecnicoActualizado = await this.prisma.avalTecnico.update({
      where: { id: coleccion.avalTecnico.id },
      data: { archivo: archivoUrl },
    });

    // También guardar la URL en la colección como `solicitudUrl` si no existe
    try {
      await this.prisma.coleccionAval.update({
        where: { id: coleccion.id },
        data: { solicitudUrl: archivoUrl } as any,
      });
    } catch (err) {
      console.error(
        'Error guardando solicitudUrl en la colección (uploadAvalArchivo):',
        err,
      );
    }

    return {
      mensaje: 'Archivo subido correctamente',
      avalTecnico: avalTecnicoActualizado,
    };
  }

  private async notifyDTMUsers(eventoNombre: string) {
    try {
      const dtmUsers = await this.prisma.usuario.findMany({
        where: {
          deleted: false,
          pushToken: { not: null },
          usuariosRol: {
            some: {
              rol: {
                nombre: { in: ['DTM', 'DTM_EIDE'] },
              },
            },
          },
        },
        select: {
          pushToken: true,
        },
      });

      const tokens = dtmUsers
        .map((user) => user.pushToken)
        .filter((token): token is string => token !== null);

      if (tokens.length > 0) {
        await this.pushNotificationsService.sendNotification(
          tokens,
          'Nueva Solicitud de Aval',
          `Se ha subido un archivo para el evento "${eventoNombre}". Por favor revisa la solicitud.`,
          {
            type: 'event-file-uploaded',
            eventoNombre,
            requiresReview: true,
          },
        );
      }
    } catch (error) {
      console.error('Error al enviar notificaciones a DTM:', error);
    }
  }

  async generateDtmPdf(
    id: number,
  ): Promise<{ buffer: Buffer; archivoUrl?: string }> {
    const evento = await this.prisma.evento.findFirst({
      where: { id, deleted: false },
      include: {
        categoria: true,
        disciplina: true,
      },
    });

    if (!evento) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }

    const reportData = {
      codigo: evento.codigo,
      disciplina: evento.disciplina.nombre,
      categoria: evento.categoria.nombre,
      genero: evento.genero,
      nombre: evento.nombre,
      lugar: evento.lugar,
      fechaInicio: evento.fechaInicio,
      fechaFin: evento.fechaFin,
      numAtletasHombres: evento.numAtletasHombres,
      numAtletasMujeres: evento.numAtletasMujeres,
      numEntrenadoresHombres: evento.numEntrenadoresHombres,
      numEntrenadoresMujeres: evento.numEntrenadoresMujeres,
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

    // Intentar subir el PDF y guardar la URL en AvalTecnico.archivo si existe
    let archivoUrl: string | undefined;
    try {
      const pdfFile: Express.Multer.File = {
        buffer: pdfBuffer,
        originalname: `aval-dtm-${id}.pdf`,
        mimetype: 'application/pdf',
        size: pdfBuffer.length,
        fieldname: 'archivo',
        encoding: '7bit',
        destination: '',
        filename: `aval-dtm-${id}.pdf`,
        path: '',
      } as any;

      archivoUrl = await this.storageService.uploadFile(pdfFile, 'avales');

      // Buscar colección/aval técnico asociado al evento
      const coleccion = await this.prisma.coleccionAval.findFirst({
        where: { eventoId: id },
        include: { avalTecnico: true },
      });

      if (coleccion?.avalTecnico) {
        await this.prisma.avalTecnico.update({
          where: { id: coleccion.avalTecnico.id },
          data: { archivo: archivoUrl },
        });
        // También guardar dtmUrl en la colección si tenemos archivoUrl
        if (archivoUrl) {
          try {
            await this.prisma.coleccionAval.update({
              where: { id: coleccion.id },
              data: { dtmUrl: archivoUrl } as any,
            });
          } catch (err) {
            console.error(
              'Error guardando dtmUrl en la colección (generateDtmPdf):',
              err,
            );
          }
        }
      }
    } catch (error) {
      console.error(
        'Error subiendo PDF DTM y actualizando avalTecnico:',
        error,
      );
    }

    return { buffer: pdfBuffer, archivoUrl };
  }

  async generatePdaPdf(
    id: number,
  ): Promise<{ buffer: Buffer; archivoUrl?: string }> {
    const evento = await this.prisma.evento.findFirst({
      where: { id, deleted: false },
      include: {
        categoria: true,
        disciplina: true,
      },
    });

    if (!evento) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }

    const reportData = {
      codigo: evento.codigo,
      disciplina: evento.disciplina.nombre,
      categoria: evento.categoria.nombre,
      genero: evento.genero,
      nombre: evento.nombre,
      lugar: evento.lugar,
      ciudad: evento.ciudad,
      provincia: evento.provincia,
      pais: evento.pais,
      fechaInicio: evento.fechaInicio,
      fechaFin: evento.fechaFin,
      numAtletasHombres: evento.numAtletasHombres,
      numAtletasMujeres: evento.numAtletasMujeres,
      numEntrenadoresHombres: evento.numEntrenadoresHombres,
      numEntrenadoresMujeres: evento.numEntrenadoresMujeres,
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

    // Intentar subir el PDF y guardar la URL en Pda.documento si existe una PDA para la colección
    let archivoUrl: string | undefined;
    try {
      const pdfFile: Express.Multer.File = {
        buffer: pdfBuffer,
        originalname: `certificacion-pda-${id}.pdf`,
        mimetype: 'application/pdf',
        size: pdfBuffer.length,
        fieldname: 'archivo',
        encoding: '7bit',
        destination: '',
        filename: `certificacion-pda-${id}.pdf`,
        path: '',
      } as any;

      archivoUrl = await this.storageService.uploadFile(pdfFile, 'avales');

      console.log('[EventsService] PDA uploaded URL:', archivoUrl);

      const coleccion = await this.prisma.coleccionAval.findFirst({
        where: { eventoId: id },
        include: { pda: true },
      });

      console.log(
        '[EventsService] Coleccion found for PDA:',
        coleccion?.id ?? null,
      );

      if (coleccion && coleccion.pda && coleccion.pda.length > 0) {
        // Actualizar el primer registro PDA asociado
        console.log(
          '[EventsService] Updating Pda.documento for pda id:',
          coleccion.pda[0].id,
        );
        await this.prisma.pda.update({
          where: { id: coleccion.pda[0].id },
          data: { documento: archivoUrl },
        });
        // Guardar también pdaUrl en la colección
        try {
          const up = await this.prisma.coleccionAval.update({
            where: { id: coleccion.id },
            data: { pdaUrl: archivoUrl } as any,
          });
          console.log('[EventsService] coleccion.pdaUrl updated:', up.id);
        } catch (err) {
          console.error('Error guardando pdaUrl en la colección:', err);
        }
      } else {
        // No existe PDA creada; no creamos una nueva porque faltan campos obligatorios
        console.warn(
          `No existe registro PDA para la colección del evento ${id}. Se subió el PDF pero no se guardó en BD.`,
        );
        // Aun así, guardar la URL en la colección para referencia
        if (coleccion) {
          try {
            const up = await this.prisma.coleccionAval.update({
              where: { id: coleccion.id },
              data: { pdaUrl: archivoUrl } as any,
            });
            console.log(
              '[EventsService] coleccion.pdaUrl updated (no pda):',
              up.id,
            );
          } catch (err) {
            console.error(
              'Error guardando pdaUrl en la colección (no existe PDA):',
              err,
            );
          }
        } else {
          console.warn('[EventsService] No coleccion found to save pdaUrl');
        }
      }
    } catch (error) {
      console.error(
        'Error subiendo PDF PDA y actualizando Pda.documento:',
        error,
      );
    }

    return { buffer: pdfBuffer, archivoUrl };
  }

  /**
   * Aprobar solicitud de aval (DTM)
   */
  async aprobarSolicitud(id: number, usuarioId: number) {
    const evento = await this.prisma.evento.findFirst({
      where: { id, deleted: false },
      include: { colecciones: true },
    });

    if (!evento) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }

    if (evento.estado !== Estado.SOLICITADO) {
      throw new Error(
        `Solo se pueden aprobar eventos en estado SOLICITADO. Estado actual: ${evento.estado}`,
      );
    }

    // Update event state and collection states in a single transaction so both change together
    let eventoActualizado;
    try {
      const [updatedEvento] = await this.prisma.$transaction([
        this.prisma.evento.update({
          where: { id },
          data: { estado: Estado.ACEPTADO },
          include: {
            disciplina: true,
            categoria: true,
            colecciones: {
              include: {
                avalTecnico: true,
                entrenadores: { include: { entrenador: true } },
              },
            },
          },
        }),
        this.prisma.coleccionAval.updateMany({
          where: { eventoId: id },
          data: { estado: Estado.ACEPTADO } as any,
        }),
      ]);

      eventoActualizado = updatedEvento;
    } catch (err) {
      console.error('Error updating event/coleccion estado to ACEPTADO:', err);
      throw err;
    }

    // Notify entrenadores using the collections included in the updated event
    try {
      await this.notifyEntrenadores(
        eventoActualizado.colecciones ?? [],
        `Tu solicitud de aval para "${eventoActualizado.nombre}" ha sido APROBADA`,
      );
    } catch (err) {
      console.error('Error notifying entrenadores after approval:', err);
    }

    // Generate consolidated 'aval' document for the collection(s)
    try {
      // For each collection generate a summary PDF that includes links to PDA/DTM
      const colecciones = eventoActualizado.colecciones ?? [];
      for (const cole of colecciones) {
        try {
          // fetch full collection with related data
          const full = await this.prisma.coleccionAval.findFirst({
            where: { id: cole.id },
            include: {
              evento: { include: { disciplina: true, categoria: true } },
              avalTecnico: {
                include: { deportistasAval: { include: { deportista: true } } },
              },
              pda: true,
              dtm: true,
              entrenadores: { include: { entrenador: true } },
            },
          });

          if (!full) continue;

          // Build report data
          const { avalCompletoReport } = await import(
            '../reports/reports/aval-completo.report'
          );

          const reportData: any = {
            codigo: full.evento.codigo,
            disciplina: full.evento.disciplina?.nombre ?? '',
            categoria: full.evento.categoria?.nombre ?? '',
            genero: full.evento.genero,
            nombre: full.evento.nombre,
            lugar: full.evento.lugar,
            fechaInicio: full.evento.fechaInicio,
            fechaFin: full.evento.fechaFin,
            dtmUrl: full.dtmUrl,
            pdaUrl: full.pdaUrl,
            deportistas: (full.avalTecnico?.deportistasAval ?? []).map((d) => ({
              nombres: d.deportista.nombres,
              apellidos: d.deportista.apellidos,
              cedula: d.deportista.cedula,
              habilitado: !!d.deportista.afiliacion,
            })),
            entrenadores: (full.entrenadores ?? []).map((e) => ({
              nombres: e.entrenador.nombres,
              apellidos: e.entrenador.apellidos,
              cedula: e.entrenador.cedula,
              rol: e.rol,
            })),
          };

          const docDefinition = avalCompletoReport(reportData);
          const pdfDoc = this.printerService.createPdf(docDefinition);
          const mainPdfBuffer: Buffer = await new Promise((resolve, reject) => {
            const chunks: Buffer[] = [];
            pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', reject);
            pdfDoc.end();
          });

          // Try to merge PDA and DTM PDFs (if available) into the main PDF
          try {
            const mergedPdf = await PDFDocument.create();

            // load main pdf and copy pages
            const mainPdfDoc = await PDFDocument.load(mainPdfBuffer);
            const mainPages = await mergedPdf.copyPages(
              mainPdfDoc,
              mainPdfDoc.getPageIndices(),
            );
            mainPages.forEach((p) => mergedPdf.addPage(p));

            // helper to fetch a remote PDF and append its pages
            const appendRemotePdf = async (url?: string | null) => {
              if (!url) return;
              try {
                const resp = await axios.get(url, {
                  responseType: 'arraybuffer',
                });
                const bytes = resp.data as ArrayBuffer;
                const remoteDoc = await PDFDocument.load(bytes);
                const pages = await mergedPdf.copyPages(
                  remoteDoc,
                  remoteDoc.getPageIndices(),
                );
                pages.forEach((p) => mergedPdf.addPage(p));
              } catch (err) {
                console.error('Error fetching/merging remote PDF', url, err);
              }
            };

            // Prefer collection-level URLs, fall back to first Pda/Dtm document fields
            const pdaUrl =
              full.pdaUrl ?? (full.pda && full.pda[0]?.documento) ?? null;
            const dtmUrl =
              full.dtmUrl ?? (full.dtm && full.dtm[0]?.documento) ?? null;

            // Append PDA then DTM
            await appendRemotePdf(pdaUrl);
            await appendRemotePdf(dtmUrl);

            const mergedBytes = await mergedPdf.save();
            const mergedBuffer = Buffer.from(mergedBytes);

            const mergedFile: Express.Multer.File = {
              buffer: mergedBuffer,
              originalname: `aval-completo-${full.id}.pdf`,
              mimetype: 'application/pdf',
              size: mergedBuffer.length,
              fieldname: 'archivo',
              encoding: '7bit',
              destination: '',
              filename: `aval-completo-${full.id}.pdf`,
              path: '',
            } as any;

            const uploadedUrl = await this.storageService.uploadFile(
              mergedFile,
              'avales',
            );

            await this.prisma.coleccionAval.update({
              where: { id: full.id },
              data: { aval: uploadedUrl } as any,
            });
          } catch (mergeErr) {
            // Fallback: upload the generated PDF without merging
            console.error(
              'Error merging PDFs, uploading main PDF only:',
              mergeErr,
            );
            const pdfFile: Express.Multer.File = {
              buffer: mainPdfBuffer,
              originalname: `aval-completo-${full.id}.pdf`,
              mimetype: 'application/pdf',
              size: mainPdfBuffer.length,
              fieldname: 'archivo',
              encoding: '7bit',
              destination: '',
              filename: `aval-completo-${full.id}.pdf`,
              path: '',
            } as any;

            const uploadedUrl = await this.storageService.uploadFile(
              pdfFile,
              'avales',
            );

            await this.prisma.coleccionAval.update({
              where: { id: full.id },
              data: { aval: uploadedUrl } as any,
            });
          }
        } catch (err) {
          console.error(
            'Error generating/saving aval document for coleccion:',
            cole.id,
            err,
          );
        }
      }
    } catch (err) {
      console.error('Error generating aval documents after approval:', err);
    }
    return eventoActualizado;
  }

  /**
   * Rechazar solicitud de aval (DTM)
   */
  async rechazarSolicitud(id: number, usuarioId: number, motivo?: string) {
    const evento = await this.prisma.evento.findFirst({
      where: { id, deleted: false },
      include: { colecciones: true },
    });

    if (!evento) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }

    if (evento.estado !== Estado.SOLICITADO) {
      throw new Error(
        `Solo se pueden rechazar eventos en estado SOLICITADO. Estado actual: ${evento.estado}`,
      );
    }

    // Update event state and collection states in a single transaction
    let eventoActualizado;
    try {
      const [updatedEvento] = await this.prisma.$transaction([
        this.prisma.evento.update({
          where: { id },
          data: { estado: Estado.RECHAZADO },
          include: {
            disciplina: true,
            categoria: true,
            colecciones: {
              include: {
                avalTecnico: true,
                entrenadores: { include: { entrenador: true } },
              },
            },
          },
        }),
        this.prisma.coleccionAval.updateMany({
          where: { eventoId: id },
          data: motivo
            ? ({ estado: Estado.RECHAZADO, comentario: motivo } as any)
            : ({ estado: Estado.RECHAZADO } as any),
        }),
      ]);

      eventoActualizado = updatedEvento;
    } catch (err) {
      console.error('Error updating event/coleccion estado to RECHAZADO:', err);
      throw err;
    }

    // Notificar al entrenador que su solicitud fue rechazada
    const mensaje = motivo
      ? `Tu solicitud de aval para "${eventoActualizado.nombre}" ha sido RECHAZADA. Motivo: ${motivo}`
      : `Tu solicitud de aval para "${eventoActualizado.nombre}" ha sido RECHAZADA`;

    try {
      await this.notifyEntrenadores(
        eventoActualizado.colecciones ?? [],
        mensaje,
      );
    } catch (err) {
      console.error('Error notifying entrenadores after rejection:', err);
    }

    return eventoActualizado;
  }

  private async notifyEntrenadores(colecciones: any[], mensaje: string) {
    try {
      const tokens: string[] = [];

      // Intentamos obtener push tokens de usuarios asociados a los entrenadores.
      // Como ahora `ColeccionEntrenador` referencia `Entrenador` (dominio),
      // buscamos un `Usuario` con la misma cédula para obtener `pushToken`.
      for (const coleccion of colecciones) {
        if (coleccion.entrenadores) {
          for (const entrenadorEntry of coleccion.entrenadores) {
            const entrenador = entrenadorEntry.entrenador;
            if (!entrenador) continue;

            // Buscar usuario con misma cédula para notificaciones (si existe)
            try {
              const usuario = await this.prisma.usuario.findFirst({
                where: {
                  cedula: entrenador.cedula,
                  pushToken: { not: null },
                },
                select: { pushToken: true },
              });

              if (usuario?.pushToken) {
                tokens.push(usuario.pushToken);
              }
            } catch (error) {
              console.error(
                'Error buscando usuario para notificar entrenador:',
                error,
              );
            }
          }
        }
      }

      if (tokens.length > 0) {
        await this.pushNotificationsService.sendNotification(
          tokens,
          'Estado de Solicitud',
          mensaje,
        );
      }
    } catch (error) {
      console.error('Error enviando notificaciones a entrenadores:', error);
    }
  }
}
