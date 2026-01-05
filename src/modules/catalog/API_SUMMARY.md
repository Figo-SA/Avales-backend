# Catalog API

Base URL: `/api/v1/catalog`

## Endpoints

### GET /
Obtener catálogo completo
```
Response: CatalogResponse
```

### GET /categorias
Obtener categorías
```
Response: CatalogItem[]
```

### GET /disciplinas
Obtener disciplinas
```
Response: CatalogItem[]
```

### GET /actividades
Obtener actividades presupuestarias
```
Response: CatalogItem[]
```

### GET /items
Obtener items presupuestarios
```
Query: { actividadId?: number }
Response: ItemResponse[]
```

### GET /items/:id
Obtener item presupuestario por ID
```
Response: ItemResponse
```

---

## DTOs

### CatalogResponse
```typescript
{
  categorias: CatalogItem[],
  disciplinas: CatalogItem[]
}
```

### CatalogItem
```typescript
{
  id: number,
  nombre: string
}
```

### ItemResponse
```typescript
{
  id: number,
  nombre: string,
  numero: number,
  descripcion: string,
  actividad?: {
    id: number,
    nombre: string,
    numero: number
  },
  createdAt: string,
  updatedAt: string
}
```
