# Users API

Base URL: `/api/v1/users`

## Endpoints

### POST /create
Crear usuario (admin)
```
Body: CreateUser
Response: UserResponse
```

### GET /
Listar usuarios (paginado)
```
Query: { page?, limit? }
Response: { items: UserResponse[], pagination: { page, limit, total } }
```

### GET /deleted
Listar usuarios eliminados
```
Response: UserResponse[]
```

### GET /:id
Obtener usuario por ID
```
Response: UserResponse
```

### PATCH /profile
Actualizar perfil propio (auth)
```
Body: UpdateUser
Response: UserResponse
```

### PATCH /:id
Actualizar usuario (admin)
```
Body: UpdateUser
Response: UserResponse
```

### DELETE /:id
Soft delete
```
Response: { id }
```

### POST /:id/restore
Restaurar usuario
```
Response: UserResponse
```

### PATCH /me/push-token
Actualizar push token (auth)
```
Body: { pushToken }
Response: UserResponse
```

---

## DTOs

### CreateUser
```typescript
{
  nombre: string,          // "Juan"
  apellido?: string,       // "Pérez"
  cedula: string,          // "1234567890" (10 dígitos)
  email: string,           // "juan@ejemplo.com"
  password: string,        // min 6, max 32
  categoriaId?: number,
  disciplinaId?: number,
  roles: TipoRol[]         // ["ADMIN", "SECRETARIA"]
}
```

### UpdateUser
```typescript
{
  nombre?: string,
  apellido?: string,
  cedula?: string,
  email?: string,
  password?: string,
  categoriaId?: number,
  disciplinaId?: number,
  roles?: TipoRol[]
}
```

### UserResponse
```typescript
{
  id: number,
  nombre: string,
  apellido?: string,
  email: string,
  cedula: string,
  categoria: { id: number, nombre: string },
  disciplina: { id: number, nombre: string },
  roles: TipoRol[],
  pushToken?: string,
  createdAt?: Date,
  updatedAt?: Date
}
```

### TipoRol (enum)
```
SUPER_ADMIN | ADMIN | SECRETARIA | ENTRENADOR | DTM | DTM_EIDE
```
