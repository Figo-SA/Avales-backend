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
