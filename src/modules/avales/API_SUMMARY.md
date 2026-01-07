# Avales API

Base URL: `/api/v1/avales`

## Descripción

El módulo de **Avales** gestiona las colecciones de avales, que representan el conjunto completo de documentos necesarios para avalar el presupuesto de un evento deportivo.

Un **aval** es una `ColeccionAval` que incluye:
- Información del evento asociado
- Aval técnico con objetivos, criterios y requerimientos presupuestarios
- Deportistas y entrenadores participantes
- Documentos generados (DTM, PDA, solicitud, aval completo)
- Historial completo de cambios de estado a través del flujo de aprobación

## Estados

```typescript
enum Estado {
  DISPONIBLE   // Evento disponible para crear solicitud
  BORRADOR     // Convocatoria subida, esperando creación del AvalTecnico
  SOLICITADO   // AvalTecnico creado, pendiente de revisión por DTM
  RECHAZADO    // Rechazado por DTM
  ACEPTADO     // Aprobado por DTM
}
```

**Ciclo de Vida del Estado**:
1. **DISPONIBLE**: Evento existe, sin convocatoria
2. **BORRADOR**: Convocatoria subida, ColeccionAval creada, esperando AvalTecnico
3. **SOLICITADO**: AvalTecnico completado, esperando revisión
4. **ACEPTADO** o **RECHAZADO**: Decisión de DTM

## Etapas del Flujo

```typescript
enum EtapaFlujo {
  SOLICITUD        // Entrenador crea la solicitud
  REVISION_DTM     // DTM revisa la solicitud
  PDA              // PDA crea el presupuesto
  CONTROL_PREVIO   // Control previo revisa
  SECRETARIA       // Secretaría revisa
  FINANCIERO       // Financiero aprueba
}
```

---

## Endpoints

### GET /
Listar avales (paginado y filtrable)

**Acceso**: Entrenador, DTM, DTM_EIDE, PDA, Admin, SuperAdmin

```
Query: {
  page?: number,        // default: 1
  limit?: number,       // default: 50
  estado?: Estado,      // DISPONIBLE | BORRADOR | SOLICITADO | RECHAZADO | ACEPTADO
  etapa?: EtapaFlujo,   // SOLICITUD | REVISION_DTM | PDA | CONTROL_PREVIO | SECRETARIA | FINANCIERO
  eventoId?: number,    // Filtrar por evento
  search?: string       // Buscar por nombre o código del evento
}
Response: {
  items: AvalResponse[],
  pagination: { page, limit, total }
}
```

**Uso del Filtro por Estado**:
- `estado=BORRADOR`: Ver avales con convocatoria subida pero sin AvalTecnico (borradores incompletos)
- `estado=SOLICITADO`: Ver avales completos pendientes de revisión
- `estado=ACEPTADO` o `estado=RECHAZADO`: Ver avales procesados por DTM

### GET /:id
Obtener aval por ID (con detalle completo)

**Acceso**: Entrenador, DTM, DTM_EIDE, PDA, Admin, SuperAdmin

```
Response: AvalResponse (incluye evento, avalTecnico, entrenadores, historial)
```

### GET /evento/:eventoId
Listar avales de un evento específico

**Acceso**: Entrenador, DTM, DTM_EIDE, PDA, Admin, SuperAdmin

```
Response: AvalResponse[]
```

### GET /:id/historial
Obtener historial completo del aval

**Acceso**: Entrenador, DTM, DTM_EIDE, PDA, Admin, SuperAdmin

```
Response: HistorialResponse[]
```

### POST /convocatoria
Subir convocatoria y crear colección de aval (Paso 1 - multipart/form-data)

**Acceso**: Entrenador, Admin, SuperAdmin

```
Body: {
  eventoId: number,
  convocatoria: File (requerido, cualquier formato, max 5MB)
}
Response: AvalResponse (ColeccionAval sin AvalTecnico)
```

**Archivo de Convocatoria** (Campo: `convocatoria`):
- Es el documento oficial de convocatoria del evento
- Formatos aceptados: Cualquier formato de archivo
- Tamaño máximo: 5MB
- **REQUERIDO** en este endpoint
- Se guarda en `ColeccionAval.convocatoriaUrl`

**Validaciones**:
- El evento debe existir y estar en estado DISPONIBLE
- No debe existir un aval previo para el mismo evento

**Proceso**:
1. Valida que el evento exista y esté DISPONIBLE
2. Sube el archivo de convocatoria
3. Crea la `ColeccionAval` con:
   - Archivo de convocatoria en `convocatoriaUrl`
   - Estado: **BORRADOR** (convocatoria subida, esperando AvalTecnico)
4. Retorna el `id` de la colección para usarlo en el paso 2

**Estado Resultante**: `BORRADOR` - Permite al frontend identificar avales con convocatoria pero sin AvalTecnico

**Flujo del Frontend**:
1. Entrenador hace clic en "Crear Aval"
2. Se abre un modal para subir la convocatoria
3. Se llama a `POST /convocatoria` con el archivo
4. Se muestra un loading mientras se crea la colección
5. Una vez creada la colección, se habilita el formulario del aval técnico

---

### POST /
Crear solicitud de aval técnico (Paso 2 - JSON)

**Acceso**: Entrenador, Admin, SuperAdmin

```
Body: CreateAval (JSON con coleccionAvalId)
Response: AvalResponse (ColeccionAval con AvalTecnico completo)
```

**Validaciones**:
- La `ColeccionAval` debe existir (del paso 1)
- La `ColeccionAval` NO debe tener ya un `AvalTecnico` **activo** (no eliminado lógicamente)
  - ✅ Si existe un `AvalTecnico` pero está eliminado (`deleted: true`), se permite crear uno nuevo
  - ❌ Si existe un `AvalTecnico` activo (`deleted: false`), se rechaza la creación
- **El número de deportistas debe coincidir exactamente con el evento**:
  - Total deportistas enviados = evento.numAtletasHombres + evento.numAtletasMujeres
  - Error si no coincide con mensaje detallado
- Todos los deportistas, entrenadores y rubros deben existir

**Proceso**:
1. Valida que la `ColeccionAval` existe y no tiene `AvalTecnico` activo
2. Valida que el número de deportistas coincida con el evento
3. Crea el `AvalTecnico` (solicitud) con:
   - Objetivos, criterios y requerimientos presupuestarios
   - Deportistas y entrenadores participantes
4. Actualiza la `ColeccionAval` a estado SOLICITADO
5. Actualiza el evento a estado SOLICITADO
6. Registra en el historial

### PATCH /:id/archivo
Subir archivo del aval (multipart/form-data)

**Acceso**: Entrenador, Admin, SuperAdmin

```
Body: archivo (jpg/png/pdf, max 5MB) [requerido]
Response: AvalResponse
```

### GET /:id/dtm-pdf
Descargar PDF de solicitud DTM

**Acceso**: DTM, DTM_EIDE, Admin, SuperAdmin

```
Response: PDF file (application/pdf)
```

Genera el PDF de la solicitud para Dirección Técnico Metodológica con:
- Datos del evento
- Objetivos y criterios de selección
- Requerimientos presupuestarios
- Listado de deportistas y entrenadores

### GET /:id/pda-pdf
Descargar PDF de certificación PDA

**Acceso**: PDA, Admin, SuperAdmin

```
Response: PDF file (application/pdf)
```

Genera el PDF de certificación para Preparación del Deportista de Alto Rendimiento.

### PATCH /:id/aprobar
Aprobar solicitud de aval

**Acceso**: DTM, DTM_EIDE, Admin, SuperAdmin

```
Body: { usuarioId: number }
Response: AvalResponse
```

**Validaciones**:
- El aval debe estar en estado SOLICITADO

**Proceso**:
1. Actualiza el aval a estado ACEPTADO
2. Actualiza el evento a estado ACEPTADO
3. Registra en el historial con etapa REVISION_DTM
4. (TODO) Notifica a entrenadores y genera PDF completo

### PATCH /:id/rechazar
Rechazar solicitud de aval

**Acceso**: DTM, DTM_EIDE, Admin, SuperAdmin

```
Body: {
  usuarioId: number,
  motivo?: string   // Motivo del rechazo
}
Response: AvalResponse
```

**Validaciones**:
- El aval debe estar en estado SOLICITADO

**Proceso**:
1. Actualiza el aval a estado RECHAZADO con el motivo
2. Actualiza el evento a estado RECHAZADO
3. Registra en el historial con etapa REVISION_DTM y motivo
4. (TODO) Notifica a entrenadores

---

## DTOs

### UploadConvocatoriaDto (Paso 1)
```typescript
{
  eventoId: number,               // ID del evento
  convocatoria: File              // Archivo de convocatoria (requerido)
}
```

### CreateAval (Paso 2)
```typescript
{
  coleccionAvalId: number,        // ID de la ColeccionAval creada en el paso 1
  fechaHoraSalida: string,        // ISO 8601: "2025-06-01T06:00:00Z"
  fechaHoraRetorno: string,       // ISO 8601: "2025-06-05T20:00:00Z"
  transporteSalida: string,       // "Bus interprovincial"
  transporteRetorno: string,
  objetivos: ObjetivoDto[],
  criterios: CriterioDto[],
  rubros: RubroPresupuestarioDto[],
  deportistas: DeportistaAvalDto[],
  entrenadores: EntrenadorAvalDto[],
  observaciones?: string
}
```

### ObjetivoDto
```typescript
{
  orden: number,
  descripcion: string
}
```

### CriterioDto
```typescript
{
  orden: number,
  descripcion: string
}
```

### RubroPresupuestarioDto
```typescript
{
  rubroId: number,
  cantidadDias: string,
  valorUnitario?: number
}
```

### DeportistaAvalDto
```typescript
{
  deportistaId: number,
  rol: string  // "ATLETA", "DELEGADO", etc.
}
```

### EntrenadorAvalDto
```typescript
{
  entrenadorId: number,
  rol: string,  // "ENTRENADOR PRINCIPAL", etc.
  esPrincipal?: boolean
}
```

### AvalResponse
```typescript
{
  id: number,
  descripcion?: string,
  estado: Estado,
  comentario?: string,
  convocatoriaUrl?: string,
  dtmUrl?: string,
  pdaUrl?: string,
  solicitudUrl?: string,
  aval?: string,
  evento: EventoSimpleDto,
  avalTecnico?: AvalTecnicoResponseDto,
  entrenadores: EntrenadorAvalResponseDto[],
  historial: HistorialResponseDto[],
  createdAt: string,
  updatedAt: string
}
```

### EventoSimpleDto
```typescript
{
  id: number,
  codigo: string,
  nombre: string,
  fechaInicio: string,
  fechaFin: string,
  ciudad: string,
  pais: string
}
```

### AvalTecnicoResponseDto
```typescript
{
  id: number,
  descripcion?: string,
  archivo?: string,
  fechaHoraSalida: string,
  fechaHoraRetorno: string,
  transporteSalida: string,
  transporteRetorno: string,
  entrenadores: number,
  atletas: number,
  observaciones?: string,
  objetivos: AvalObjetivoResponseDto[],
  criterios: AvalCriterioResponseDto[],
  requerimientos: AvalRequerimientoResponseDto[],
  deportistasAval: DeportistaAvalResponseDto[]
}
```

### HistorialResponseDto
```typescript
{
  id: number,
  estado: Estado,
  etapa: EtapaFlujo,
  comentario?: string,
  usuario: UsuarioSimpleDto,
  createdAt: string
}
```

---

## Flujo de Trabajo

### 1. Subir Convocatoria (Paso 1)
1. Entrenador selecciona un evento DISPONIBLE
2. Entrenador sube el archivo de convocatoria (`POST /avales/convocatoria`)
3. Sistema valida que el evento esté DISPONIBLE
4. Sistema crea la `ColeccionAval` con el archivo de convocatoria
5. **Estado de la colección: BORRADOR** (convocatoria subida, sin AvalTecnico)
6. Sistema retorna el `id` de la colección

**Importante**: En este punto, el aval está en estado `BORRADOR`. Si el entrenador no completa el paso 2, el aval quedará en este estado, permitiendo identificar convocatorias subidas pero incompletas.

### 2. Crear Solicitud de Aval Técnico (Paso 2)
1. Frontend habilita el formulario de solicitud
2. Entrenador completa el formulario con:
   - Fechas y transportes
   - Objetivos y criterios
   - Rubros presupuestarios
   - Deportistas y entrenadores
3. Entrenador envía la solicitud (`POST /avales`)
4. Sistema valida:
   - Que la ColeccionAval exista
   - Que NO tenga ya un AvalTecnico
   - Que el número de deportistas coincida con el evento
5. Se crea el `AvalTecnico` con todos los datos
6. Estado cambia a SOLICITADO (tanto la colección como el evento)
7. Se registra en el historial

### 3. Revisión DTM
1. DTM descarga el PDF de solicitud (`GET /:id/dtm-pdf`)
2. DTM revisa la solicitud
3. DTM aprueba (`PATCH /:id/aprobar`) o rechaza (`PATCH /:id/rechazar`)
4. Se notifica al entrenador

### 3. Si es Aprobado
1. Sistema genera PDF completo del aval
2. Estado cambia a ACEPTADO
3. Continúa con el flujo de PDA, Control Previo, etc.

### 4. Si es Rechazado
1. Estado cambia a RECHAZADO
2. Se guarda el motivo del rechazo
3. Entrenador puede ver el motivo en el historial

---

## Notas Importantes

- **Un aval ES una ColeccionAval**: No es solo una colección de documentos, es la entidad principal que representa todo el proceso de solicitud de presupuesto.

- **Relación con Eventos**: Cada aval está asociado a un único evento. El estado del evento se sincroniza con el estado del aval.

- **Historial Completo**: Todos los cambios de estado se registran en `HistorialColeccion` con el usuario, fecha, etapa y comentarios.

- **Archivos en la ColeccionAval**:
  - `convocatoriaUrl`: Archivo de convocatoria del evento (subido al crear el aval)
  - `solicitudUrl`: Archivo subido por el entrenador (opcional)
  - `dtmUrl`: PDF generado para DTM
  - `pdaUrl`: PDF de certificación PDA
  - `aval`: PDF completo del aval (generado al aprobar)

- **Validaciones de Estado**: Solo se puede aprobar o rechazar un aval en estado SOLICITADO.

- **Multipart Form Data**: Los endpoints que suben archivos usan `multipart/form-data`. La convocatoria acepta cualquier formato de archivo con tamaño máximo de 5MB. Otros archivos pueden tener restricciones de formato específicas.

---

## ⚠️ Endpoints Deprecados (Compatibilidad)

Los siguientes endpoints en `/api/v1/events` están **DEPRECADOS** pero siguen funcionando para compatibilidad con clientes existentes:

| Endpoint Deprecado | Nuevo Endpoint | Estado |
|-------------------|----------------|--------|
| `POST /events/:id/aval` | `POST /avales` | ⚠️ DEPRECATED |
| `PATCH /events/:id/aval/archivo` | `PATCH /avales/:avalId/archivo` | ⚠️ DEPRECATED |
| `GET /events/:id/dtm-pdf` | `GET /avales/:avalId/dtm-pdf` | ⚠️ DEPRECATED |
| `GET /events/:id/pda-pdf` | `GET /avales/:avalId/pda-pdf` | ⚠️ DEPRECATED |
| `PATCH /events/:id/aprobar` | `PATCH /avales/:avalId/aprobar` | ⚠️ DEPRECATED |
| `PATCH /events/:id/rechazar` | `PATCH /avales/:avalId/rechazar` | ⚠️ DEPRECATED |

**Importante**:
- Los endpoints deprecados usan el **ID del evento** como parámetro
- Los nuevos endpoints usan el **ID del aval** (ColeccionAval)
- Se recomienda migrar a los nuevos endpoints
- Los endpoints deprecados se eliminarán en versiones futuras

---

## Filtrado por Disciplina (Seguridad)

### Contexto
Los entrenadores tienen asignada una disciplina en su perfil:
```typescript
Usuario {
  disciplinaId: number,  // Ej: 1 = Atletismo, 2 = Natación
  categoriaId: number,
  roles: ["entrenador"]
}
```

### Comportamiento con Eventos

Cuando un entrenador lista eventos para crear un aval:
1. El sistema filtra automáticamente eventos por su `disciplinaId`
2. Solo ve eventos de su disciplina
3. Esto asegura que solo pueda crear avales para eventos de su deporte

**Ejemplo**:
```
Entrenador: María (disciplinaId: 2 - Natación)

GET /api/v1/events (para seleccionar evento)
→ Solo retorna eventos de Natación
→ No puede crear avales para eventos de Atletismo, Fútbol, etc.

POST /api/v1/avales
Body: { eventoId: 123, ... }
→ Solo puede crear aval si evento 123 es de Natación
```

### Ventajas

✅ **Seguridad**: Entrenadores solo gestionan avales de su disciplina
✅ **Datos Consistentes**: Los usuarios ya tienen `disciplinaId` en su perfil
✅ **Sin Migración**: No se requieren cambios en la base de datos
✅ **Filtrado Automático**: Se aplica desde el JWT del usuario
