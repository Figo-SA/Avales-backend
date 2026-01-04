# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS backend (TypeScript) for managing "avales" (endorsements/guarantees) for a sports federation. Uses Prisma ORM with PostgreSQL.

## Common Commands

```bash
# Install dependencies (pnpm or npm)
pnpm install
npm install

# Development server (watch mode)
npm run start:dev

# Build and run production
npm run build
npm start

# Database migrations
npx prisma migrate dev --name descriptive_name
npx prisma generate

# Tests
npm run test                    # Unit tests
npm run test:watch              # Watch mode
npm run test:e2e                # E2E tests

# Lint and format
npm run lint
npm run format
```

## Architecture

### Module Structure
- `src/modules/` - Feature modules (auth, users, deportistas, events, catalog, mail, push-notifications, reports, seeding)
- `src/common/` - Shared utilities (interceptors, filters, decorators, DTOs, pipes, swagger helpers)
- `src/prisma/` - PrismaModule (global)
- `src/config/` - Configuration files (jwt.config, database.config)

### API Patterns
- Global prefix: `/api/v1` (set in `main.ts`)
- Swagger docs: `/api/docs`
- Success responses wrapped by `ResponseInterceptor` into `ApiResponseDto` with metadata (requestId, timestamp, apiVersion, durationMs)
- Errors follow RFC 7807 Problem Details (`application/problem+json`) via `GlobalExceptionFilter`

### Key Decorators and Helpers
- `@SuccessMessage('text')` - Sets success message for response interceptor
- `@Auth(ValidRoles.ADMIN, ...)` - Role-based authorization
- Swagger: Use `ApiOkResponseData`, `ApiCreatedResponseData`, `ApiOkResponsePaginated` from `src/common/swagger/decorators/`
- Error docs: `ApiErrorResponsesConfig`

### Database (Prisma)
- Schema: `prisma/schema.prisma`
- Primary keys: `Int` type (use `ParseIntPipe` in controllers)
- Soft-delete pattern: Most models have `deleted: Boolean` column
- Key enums: `Estado` (DISPONIBLE, SOLICITADO, RECHAZADO, ACEPTADO), `TipoRol` (user roles), `Genero`

### Domain Models
- `Usuario` / `UsuarioRol` / `Rol` - Users with role-based access
- `Evento` - Events/competitions with metadata
- `ColeccionAval` - Collection of endorsement documents per event
- `AvalTecnico` - Technical endorsement with objectives, criteria, requirements
- `Deportista` / `Entrenador` - Athletes and coaches
- `Pda` / `Dtm` / `Financiero` - Supporting documents with their own history tracking
- `Categoria` / `Disciplina` - Catalog items for classification

### Environment Variables
- `DATABASE_URL` - Prisma connection string
- `PORT` - Server port (default 3000)
- `API_VERSION` - Optional, used by ResponseInterceptor
- `ERRORS_BASE_URL` - Optional, used by GlobalExceptionFilter

## Key Files Reference
- `src/main.ts` - Bootstrap, global pipes, CORS, Swagger setup
- `src/common/interceptors/response/response.interceptor.ts` - Success response wrapper
- `src/common/filters/global-exception/global-exception.filter.ts` - Error handling
- `src/common/dtos/api-response.dto.ts` - Response envelope structure
- `src/common/handlers/` - Specialized error handlers (Prisma errors)
