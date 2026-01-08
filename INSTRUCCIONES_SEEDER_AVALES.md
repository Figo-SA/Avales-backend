# Instrucciones para Agregar Seeder de Avales

## Paso 1: Ubicación en el archivo
Abre el archivo: `src/modules/seeding/seeding.service.ts`

## Paso 2: Los métodos ya están agregados
Busca la línea 49 donde dice:
```typescript
await this.createAvales();
```

Esta línea ya está agregada y llama al método `createAvales()` que necesitas agregar.

## Paso 3: Agregar los dos métodos

Copia y pega los siguientes dos métodos **ANTES** del método `async getDatabaseStatus()` (alrededor de la línea 362).

Los métodos van justo después del método `createDeportistas()` y antes de `getDatabaseStatus()`:

```typescript
  private async createAvales() {
    const { Estado, EtapaFlujo } = await import('@prisma/client');

    // Obtener eventos con diferentes estados
    const eventosSolicitados = await this.prisma.evento.findMany({
      where: { estado: Estado.SOLICITADO },
      include: { disciplina: true, categoria: true },
      take: 3,
    });

    const eventosAceptados = await this.prisma.evento.findMany({
      where: { estado: Estado.ACEPTADO },
      include: { disciplina: true, categoria: true },
      take: 2,
    });

    const eventosRechazados = await this.prisma.evento.findMany({
      where: { estado: Estado.RECHAZADO },
      include: { disciplina: true, categoria: true },
      take: 1,
    });

    // Obtener entrenadores, deportistas y rubros
    const entrenadores = await this.prisma.entrenador.findMany({ take: 10 });
    const deportistas = await this.prisma.deportista.findMany({ take: 100 });
    const rubros = await this.prisma.rubro.findMany();
    const usuarios = await this.prisma.usuario.findMany({ take: 5 });

    let avalesCreados = 0;
    let avalesBorradorCreados = 0;

    // Crear avales SOLICITADOS (completos)
    for (const evento of eventosSolicitados) {
      const avalCreado = await this.createAvalCompleto(
        evento,
        entrenadores,
        deportistas,
        rubros,
        usuarios[0]?.id || 1,
        Estado.SOLICITADO,
      );
      if (avalCreado) avalesCreados++;
    }

    // Crear avales ACEPTADOS (completos)
    for (const evento of eventosAceptados) {
      const avalCreado = await this.createAvalCompleto(
        evento,
        entrenadores,
        deportistas,
        rubros,
        usuarios[0]?.id || 1,
        Estado.ACEPTADO,
      );
      if (avalCreado) avalesCreados++;
    }

    // Crear avales RECHAZADOS (completos)
    for (const evento of eventosRechazados) {
      const avalCreado = await this.createAvalCompleto(
        evento,
        entrenadores,
        deportistas,
        rubros,
        usuarios[0]?.id || 1,
        Estado.RECHAZADO,
      );
      if (avalCreado) avalesCreados++;
    }

    // Crear 2 avales en estado BORRADOR (solo convocatoria, sin AvalTecnico)
    const eventosDisponibles = await this.prisma.evento.findMany({
      where: { estado: Estado.DISPONIBLE },
      take: 2,
    });

    for (const evento of eventosDisponibles) {
      await this.prisma.coleccionAval.create({
        data: {
          descripcion: `Aval en borrador para ${evento.nombre}`,
          eventoId: evento.id,
          estado: Estado.BORRADOR,
          convocatoriaUrl: `https://storage.example.com/convocatorias/borrador-${evento.id}.pdf`,
        },
      });
      avalesBorradorCreados++;
    }

    this.logger.log(`📋 ${avalesCreados} avales completos creados`);
    this.logger.log(`📝 ${avalesBorradorCreados} avales en BORRADOR creados (solo convocatoria)`);
  }

  private async createAvalCompleto(
    evento: any,
    entrenadores: any[],
    deportistas: any[],
    rubros: any[],
    usuarioId: number,
    estadoFinal: any,
  ): Promise<boolean> {
    try {
      const { EtapaFlujo } = await import('@prisma/client');

      // Seleccionar entrenadores de la misma disciplina
      const entrenadoresEvento = entrenadores
        .filter((e) => e.disciplinaId === evento.disciplinaId)
        .slice(0, evento.numEntrenadoresHombres + evento.numEntrenadoresMujeres);

      if (entrenadoresEvento.length === 0) {
        this.logger.warn(`⚠️ No hay entrenadores disponibles para evento ${evento.codigo}`);
        return false;
      }

      // Seleccionar deportistas de la misma disciplina
      const deportistasEvento = deportistas
        .filter((d) => d.disciplinaId === evento.disciplinaId)
        .slice(0, evento.numAtletasHombres + evento.numAtletasMujeres);

      if (deportistasEvento.length < (evento.numAtletasHombres + evento.numAtletasMujeres)) {
        this.logger.warn(
          `⚠️ No hay suficientes deportistas para evento ${evento.codigo} (requiere ${evento.numAtletasHombres + evento.numAtletasMujeres}, disponibles: ${deportistasEvento.length})`
        );
        return false;
      }

      // Seleccionar 3-5 rubros aleatorios
      const rubrosSeleccionados = rubros.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 3);

      const descripcion = `Solicitud de aval para ${evento.nombre} - ${evento.lugar}, ${evento.ciudad}`;

      await this.prisma.$transaction(async (tx) => {
        // 1. Crear ColeccionAval
        const coleccion = await tx.coleccionAval.create({
          data: {
            descripcion,
            eventoId: evento.id,
            estado: estadoFinal,
            convocatoriaUrl: `https://storage.example.com/convocatorias/${evento.codigo}.pdf`,
          },
        });

        // 2. Crear AvalTecnico
        const avalTecnico = await tx.avalTecnico.create({
          data: {
            coleccionAvalId: coleccion.id,
            descripcion,
            fechaHoraSalida: new Date(evento.fechaInicio.getTime() - 24 * 60 * 60 * 1000), // 1 día antes
            fechaHoraRetorno: new Date(evento.fechaFin.getTime() + 24 * 60 * 60 * 1000), // 1 día después
            transporteSalida: 'Bus interprovincial',
            transporteRetorno: 'Bus interprovincial',
            entrenadores: entrenadoresEvento.length,
            atletas: deportistasEvento.length,
            observaciones: 'Observaciones generadas automáticamente por el seeder',
          },
        });

        // 3. Crear objetivos (2-3)
        const numObjetivos = Math.floor(Math.random() * 2) + 2;
        const objetivos = [
          'Obtener experiencia internacional en competencias de alto nivel',
          'Mejorar el rendimiento técnico de los atletas',
          'Clasificar para torneos internacionales',
          'Fortalecer el trabajo en equipo',
          'Aplicar estrategias entrenadas en preparación',
        ];

        for (let i = 0; i < numObjetivos; i++) {
          await tx.avalObjetivo.create({
            data: {
              avalTecnicoId: avalTecnico.id,
              orden: i + 1,
              descripcion: objetivos[i],
            },
          });
        }

        // 4. Crear criterios (2-3)
        const numCriterios = Math.floor(Math.random() * 2) + 2;
        const criterios = [
          'Rendimiento en competencias nacionales previas',
          'Asistencia y dedicación en entrenamientos',
          'Condición física y estado de salud',
          'Compromiso con los objetivos del equipo',
          'Disciplina y comportamiento deportivo',
        ];

        for (let i = 0; i < numCriterios; i++) {
          await tx.avalCriterio.create({
            data: {
              avalTecnicoId: avalTecnico.id,
              orden: i + 1,
              descripcion: criterios[i],
            },
          });
        }

        // 5. Crear requerimientos presupuestarios
        for (const rubro of rubrosSeleccionados) {
          await tx.avalRequerimiento.create({
            data: {
              avalTecnicoId: avalTecnico.id,
              rubroId: rubro.id,
              cantidadDias: (Math.floor(Math.random() * 5) + 3).toString(),
              valorUnitario: Math.floor(Math.random() * 100) + 20,
            },
          });
        }

        // 6. Crear deportistas del aval
        const rolesDeportistas = ['ATLETA', 'DELEGADO', 'SUPLENTE'];
        for (const [index, deportista] of deportistasEvento.entries()) {
          const rol = index === 0 ? 'DELEGADO' : rolesDeportistas[Math.floor(Math.random() * rolesDeportistas.length)];
          await tx.deportistaAval.create({
            data: {
              avalTecnicoId: avalTecnico.id,
              deportistaId: deportista.id,
              rol,
            },
          });
        }

        // 7. Crear entrenadores de la colección
        for (const [index, entrenador] of entrenadoresEvento.entries()) {
          await tx.coleccionEntrenador.create({
            data: {
              coleccionAvalId: coleccion.id,
              entrenadorId: entrenador.id,
              rol: index === 0 ? 'ENTRENADOR PRINCIPAL' : 'ASISTENTE',
              esPrincipal: index === 0,
            },
          });
        }

        // 8. Crear historial según el estado
        let etapa = EtapaFlujo.SOLICITUD;
        let comentario = 'Solicitud de aval creada';

        if (estadoFinal === 'ACEPTADO') {
          etapa = EtapaFlujo.REVISION_DTM;
          comentario = 'Aval aprobado por DTM';
        } else if (estadoFinal === 'RECHAZADO') {
          etapa = EtapaFlujo.REVISION_DTM;
          comentario = 'Aval rechazado - Presupuesto insuficiente';
        }

        await tx.historialColeccion.create({
          data: {
            coleccionAvalId: coleccion.id,
            estado: estadoFinal,
            etapa,
            usuarioId,
            comentario,
          },
        });
      });

      return true;
    } catch (error) {
      this.logger.error(`❌ Error creando aval para evento ${evento.codigo}:`, error.message);
      return false;
    }
  }
```

## Paso 4: Verificar la compilación
Después de agregar los métodos, ejecuta:
```bash
npm run build
```

## Paso 5: Ejecutar el seeder
Para poblar la base de datos con los nuevos avales:
```bash
# A través de la API
POST http://localhost:3000/api/v1/seeding
```

## Qué crea el seeder:

### Avales Completos (con AvalTecnico):
- **3 avales en estado SOLICITADO** - Para eventos que ya tenían estado SOLICITADO
- **2 avales en estado ACEPTADO** - Para eventos que ya tenían estado ACEPTADO
- **1 aval en estado RECHAZADO** - Para eventos que ya tenían estado RECHAZADO

### Avales en Borrador (solo convocatoria):
- **2 avales en estado BORRADOR** - Solo tienen ColeccionAval con convocatoria, sin AvalTecnico

Cada aval completo incluye:
- ColeccionAval con convocatoriaUrl
- AvalTecnico con fechas, transportes y observaciones
- 2-3 Objetivos
- 2-3 Criterios de selección
- 3-5 Requerimientos presupuestarios (rubros)
- Deportistas del evento asignados con roles (ATLETA, DELEGADO, SUPLENTE)
- Entrenadores de la colección (uno marcado como principal)
- Historial con el estado actual y etapa del flujo

Los avales en BORRADOR solo tienen:
- ColeccionAval con convocatoriaUrl
- Estado: BORRADOR
- NO tienen AvalTecnico (para simular el escenario donde el entrenador olvidó completar)
