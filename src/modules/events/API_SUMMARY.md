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
```
Query: { page?, limit?, estado?, search? }
Response: { items: EventResponse[], pagination: { page, limit, total } }
```

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
