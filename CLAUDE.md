# CLAUDE.md

Este archivo proporciona guía a Claude Code (claude.ai/code) para trabajar con el código de este repositorio.

## Descripción del Proyecto

Backend en NestJS (TypeScript) para gestionar "avales" de una federación deportiva. Usa Prisma ORM con PostgreSQL.

## Comandos Comunes

```bash
npm run start:dev          # Servidor de desarrollo (watch mode)
npm run build              # Compilar para producción
npx prisma migrate dev     # Ejecutar migraciones
npx prisma generate        # Generar cliente de Prisma
npm run lint               # Verificar código
npm run format             # Formatear código
```

## Arquitectura

### Estructura de Módulos
- `src/modules/` - Módulos de funcionalidad (users, athletes, events, catalog, mail, push-notifications, seeding)
- `src/common/` - Utilidades compartidas (interceptors, filters, decorators, DTOs, pipes, helpers de swagger)
- `src/prisma/` - PrismaModule (global)
- `src/config/` - Archivos de configuración (jwt.config, database.config)

### Patrones de API
- Prefijo global: `/api/v1` (configurado en `main.ts`)
- Documentación Swagger: `/api/docs`
- Respuestas exitosas envueltas por `ResponseInterceptor` en `ApiResponseDto`
- Errores siguen RFC 7807 Problem Details mediante `GlobalExceptionFilter`

### Base de Datos (Prisma)
- Schema: `prisma/schema.prisma`
- Llaves primarias: tipo `Int` (usar `ParseIntPipe` en controllers)
- Patrón soft-delete: La mayoría de modelos tienen columna `deleted: Boolean`

---

## Convenciones para Crear Módulos

### Idioma del Código
- **Nombres de clases, funciones, variables**: En inglés
- **Documentación Swagger y comentarios**: En español
- **Campos de DTOs**: En español, deben coincidir exactamente con el schema de Prisma

### Estructura de Carpetas por Módulo

```
src/modules/{module-name}/
├── decorators/
│   └── api-{module}-responses.decorator.ts
├── dto/
│   ├── {entity}-base.dto.ts
│   ├── create-{entity}.dto.ts
│   ├── update-{entity}.dto.ts
│   ├── {entity}-query.dto.ts
│   └── {entity}-response.dto.ts
├── exceptions/
│   └── {module}.exceptions.ts
├── {module}.controller.ts
├── {module}.service.ts
└── {module}.module.ts
```

### Archivos y su Propósito

| Archivo | Propósito |
|---------|-----------|
| `{entity}-base.dto.ts` | DTO base con campos compartidos entre Create y Update |
| `create-{entity}.dto.ts` | Extiende del base, sin modificaciones |
| `update-{entity}.dto.ts` | Usa `PartialType` del base para hacer campos opcionales |
| `{entity}-query.dto.ts` | Parámetros de paginación (`page`, `limit`) y filtros |
| `{entity}-response.dto.ts` | Estructura de respuesta al frontend |
| `{module}.exceptions.ts` | Excepciones tipadas del módulo |
| `api-{module}-responses.decorator.ts` | Decoradores Swagger que encapsulan la documentación |

### Excepciones Tipadas

Cada módulo define sus propias excepciones que extienden de `HttpException`:

- `{Entity}Exception` - Clase base con `message`, `errorCode`, `field` y `statusCode`
- `{Entity}NotFoundException` - 404, entidad no encontrada
- `{Entity}AlreadyDeletedException` - 400, entidad ya eliminada
- `{Entity}NotDeletedException` - 400, entidad no está eliminada (para restore/hardDelete)

### DTOs

**Reglas generales:**
- Usar decoradores de `class-validator` para validación
- Usar `@Transform` de `class-transformer` para sanitizar (trim, uppercase, etc.)
- Usar `@ApiProperty` / `@ApiPropertyOptional` para documentación Swagger
- Los nombres de campos deben coincidir con el schema de Prisma

**Base DTO:**
- Contiene todos los campos compartidos entre crear y actualizar
- Strings deben usar `@Transform` para hacer trim
- IDs de relaciones usan `@Type(() => Number)` para conversión

**Create DTO:**
- Simplemente extiende del Base DTO: `extends {Entity}BaseDto`

**Update DTO:**
- Usa `PartialType` de `@nestjs/swagger`: `extends PartialType({Entity}BaseDto)`

**Query DTO:**
- `page` y `limit` con valores por defecto (1 y 50)
- Filtros opcionales según el módulo
- Usar `@Type(() => Number)` para query params numéricos
- Usar `@Transform` para booleans desde strings

**Response DTO:**
- Define la estructura exacta de respuesta
- Fechas como `string` (ISO 8601)
- Relaciones como objetos embebidos con `id` y `nombre`

### Decoradores Swagger Personalizados

Cada endpoint tiene su decorador que encapsula:
- `ApiOperation` - summary y description
- `SuccessMessage` - mensaje de éxito para el interceptor
- `ApiParam` / `ApiQuery` - parámetros de ruta y query
- `ApiOkResponseData` / `ApiCreatedResponseData` / `ApiOkResponsePaginated` - respuestas exitosas
- `ApiErrorResponsesConfig` - códigos de error posibles con ejemplos

Nombres de decoradores: `ApiGet{Entities}`, `ApiGet{Entity}`, `ApiCreate{Entity}`, `ApiUpdate{Entity}`, `ApiDelete{Entity}`, `ApiRestore{Entity}`, `ApiHardDelete{Entity}`

### Controller

**Endpoints estándar:**
- `GET /` - Listar con paginación y filtros
- `GET /:id` - Obtener por ID
- `POST /` - Crear
- `PATCH /:id` - Actualizar
- `DELETE /:id` - Soft delete
- `PATCH /:id/restore` - Restaurar
- `DELETE /:id/permanent` - Hard delete

**Reglas:**
- Usar `ParseIntPipe` para IDs en rutas
- Usar decoradores Swagger personalizados (no inline)
- Métodos delegando al service

### Service

**Métodos estándar:**
- `findAll(query)` - Listado paginado con filtros
- `findOne(id)` - Obtener por ID
- `create(dto)` - Crear
- `update(id, dto)` - Actualizar
- `softDelete(id)` - Marcar como eliminado
- `restore(id)` - Restaurar eliminado
- `hardDelete(id)` - Eliminar permanentemente

**Patrones:**
- Método privado `mapToResponse()` para transformar entidad de Prisma a DTO
- Usar `$transaction` para queries que necesitan count + findMany
- Soft delete: filtrar siempre por `deleted: false`
- Hard delete: solo permitido si ya está soft-deleted
- Lanzar excepciones tipadas del módulo

### Module

- Importar Controller y Service
- Exportar Service si otros módulos lo necesitan

---

## Helpers de Swagger Disponibles

| Helper | Uso |
|--------|-----|
| `@SuccessMessage('texto')` | Define mensaje de éxito para ResponseInterceptor |
| `ApiOkResponseData(Dto)` | Respuesta 200 con data |
| `ApiCreatedResponseData(Dto)` | Respuesta 201 con data |
| `ApiOkResponsePaginated(Dto)` | Respuesta 200 paginada |
| `ApiErrorResponsesConfig([400, 404, ...])` | Documenta errores posibles |
| `@Auth(ValidRoles.ADMIN)` | Autorización por roles |

---

## Módulo de Referencia

Ver `src/modules/athletes/` como implementación de referencia de estas convenciones.
