# Athletes API

Base URL: `/api/v1/athletes`

## Endpoints

### GET /
Listar atletas (paginado y filtrable)
```
Query: { page?, limit?, genero?, query?, soloAfiliados? }
Response: { items: AthleteResponse[], pagination: { page, limit, total } }
```

### GET /:id
Obtener atleta por ID
```
Response: AthleteResponse
```

### GET /search/cedula
Buscar atleta por cédula exacta
```
Query: { cedula }
Response: AthleteResponse
```

### POST /
Crear atleta
```
Body: CreateAthlete
Response: AthleteResponse
```

### PATCH /:id
Actualizar atleta
```
Body: UpdateAthlete (campos opcionales de CreateAthlete)
Response: AthleteResponse
```

### DELETE /:id
Soft delete
```
Response: { id }
```

### PATCH /:id/restore
Restaurar atleta eliminado
```
Response: AthleteResponse
```

### DELETE /:id/permanent
Eliminar permanentemente
```
Response: { id }
```

---

## DTOs

### CreateAthlete
```typescript
{
  nombres: string,           // "Juan Carlos"
  apellidos: string,         // "Pérez González"
  cedula: string,            // "1750123456"
  fechaNacimiento: string,   // "2005-03-15" (ISO 8601)
  genero: "MASCULINO" | "FEMENINO",
  categoriaId: number,
  disciplinaId: number,
  afiliacion: boolean,
  afiliacionInicio?: string  // "2024-01-01" (ISO 8601)
}
```

### AthleteResponse
```typescript
{
  id: number,
  nombres: string,
  apellidos: string,
  cedula: string,
  fechaNacimiento: string,
  genero: string,
  afiliacion: boolean,
  categoria?: { id: number, nombre: string },
  disciplina?: { id: number, nombre: string },
  afiliacionInicio?: string,
  afiliacionFin?: string,
  createdAt: string,
  updatedAt: string
}
```

### Query Params (GET /)
```typescript
{
  page?: number,        // default: 1
  limit?: number,       // default: 50
  genero?: "MASCULINO" | "FEMENINO",
  query?: string,       // busca en nombres, apellidos, cedula
  soloAfiliados?: boolean  // default: true
}
```
