# Events API

Base URL: `/api/v1/events`

## Endpoints

### POST /
Crear evento (multipart/form-data)
```
Body: CreateEvent + archivo? (jpg/png/pdf, max 5MB)
Response: EventResponse
```

### GET /
Listar eventos (paginado y filtrable)

**Acceso**: Entrenador, Admin, SuperAdmin

**Filtrado Automático por Rol**:
- **Entrenadores**: Solo ven eventos de su disciplina (filtro automático por `disciplinaId` del usuario)
- **Admins/SuperAdmins**: Ven todos los eventos sin restricción

```
Query: {
  page?: number,      // default: 1
  limit?: number,     // default: 10
  estado?: Estado,    // DISPONIBLE | BORRADOR | SOLICITADO | RECHAZADO | ACEPTADO
  search?: string,    // Buscar por nombre, código, lugar, ciudad, provincia
  sinAval?: boolean   // true = solo eventos SIN aval, false/undefined = todos
}
Response: { items: EventResponse[], pagination: { page, limit, total } }
```

**Nota**: El filtro por disciplina se aplica automáticamente desde el JWT del usuario. No es necesario enviarlo en el query.

### GET /:id
Obtener evento por ID
```
Response: EventResponse
```

### PATCH /:id
Actualizar evento
```
Body: UpdateEvent (campos opcionales de CreateEvent)
Response: EventResponse
```

### DELETE /:id
Soft delete
```
Response: { id }
```

### PATCH /:id/restore
Restaurar evento
```
Response: EventResponse
```

---

## DTOs

### CreateEvent
```typescript
{
  codigo: string,              // "EVT-2025-001"
  tipoParticipacion: string,   // "Internacional"
  tipoEvento: string,          // "Campeonato"
  nombre: string,              // "Campeonato Nacional de Atletismo 2025"
  lugar: string,               // "Estadio Olímpico Atahualpa"
  genero: Genero,              // "MASCULINO" | "FEMENINO" | "MASCULINO_FEMENINO"
  disciplinaId: number,
  categoriaId: number,
  provincia: string,           // "Pichincha"
  ciudad: string,              // "Quito"
  pais: string,                // "Ecuador"
  alcance: string,             // "Nacional"
  fechaInicio: string,         // "2025-12-01T08:00:00Z"
  fechaFin: string,            // "2025-12-05T18:00:00Z"
  numEntrenadoresHombres: number,
  numEntrenadoresMujeres: number,
  numAtletasHombres: number,
  numAtletasMujeres: number
}
```

### EventResponse
```typescript
{
  id: number,
  codigo: string,
  tipoParticipacion: string,
  tipoEvento: string,
  nombre: string,
  lugar: string,
  genero: Genero,
  disciplinaId: number,
  categoriaId: number,
  provincia: string,
  ciudad: string,
  pais: string,
  alcance: string,
  fechaInicio: Date,
  fechaFin: Date,
  numEntrenadoresHombres: number,
  numEntrenadoresMujeres: number,
  numAtletasHombres: number,
  numAtletasMujeres: number,
  createdAt: Date,
  updatedAt: Date,
  eventoItems?: EventoItemResponse[]  // Items presupuestarios asignados
}
```

### EventoItemResponse
```typescript
{
  id: number,
  mes: number,                    // 1-12
  presupuesto: string,            // "1500.00"
  item: {
    id: number,
    nombre: string,
    numero: number,
    descripcion: string,
    actividad?: {
      id: number,
      nombre: string,
      numero: number
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Query Params (GET /)
```typescript
{
  page?: number,     // default: 1
  limit?: number,    // default: 10
  estado?: Estado,   // "DISPONIBLE" | "SOLICITADO" | "RECHAZADO" | "ACEPTADO"
  search?: string    // busca en nombre, código, lugar, ciudad, provincia
}
```

### Enums
```typescript
Genero: "MASCULINO" | "FEMENINO" | "MASCULINO_FEMENINO"
Estado: "DISPONIBLE" | "SOLICITADO" | "RECHAZADO" | "ACEPTADO"
```

---

## Filtrado por Disciplina (Seguridad)

### Contexto
Los usuarios tienen asignada una disciplina y categoría en su perfil:
```typescript
Usuario {
  disciplinaId: number,  // Ej: 1 = Atletismo, 2 = Natación
  categoriaId: number,
  ...
}
```

### Comportamiento Automático

#### Para Entrenadores
Cuando un entrenador hace login, el sistema:
1. Extrae su `disciplinaId` del JWT
2. Automáticamente filtra eventos: `WHERE disciplinaId = usuario.disciplinaId`
3. Solo retorna eventos de su disciplina

**Ejemplo**:
```
Usuario: Juan (entrenadorId: 10, disciplinaId: 1 - Atletismo)

GET /api/v1/events
→ Solo retorna eventos donde disciplinaId = 1 (Atletismo)
→ No puede ver eventos de Natación, Fútbol, etc.
```

#### Para Admins y SuperAdmins
- **Sin filtro**: Ven todos los eventos de todas las disciplinas
- Pueden gestionar eventos de cualquier deporte

### Casos de Uso

**Caso 1: Entrenador crea solicitud de aval**
```
1. Entrenador de Atletismo hace login
2. Lista eventos disponibles → Solo ve eventos de Atletismo
3. Selecciona un evento de su disciplina
4. Crea solicitud de aval para ese evento
```

**Caso 2: Admin gestiona todos los eventos**
```
1. Admin hace login
2. Lista eventos → Ve TODOS los eventos (Atletismo, Natación, Fútbol, etc.)
3. Puede administrar cualquier evento
```

### Ventajas de este Enfoque

✅ **Seguridad**: El entrenador no puede manipular el filtro
✅ **Automático**: No requiere parámetros adicionales en el frontend
✅ **Transparente**: El JWT ya contiene la información necesaria
✅ **Escalable**: Fácil agregar más reglas de filtrado por rol
