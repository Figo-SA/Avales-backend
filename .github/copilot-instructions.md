## Quick orientation for AI coding assistants

This repository is a NestJS backend (TypeScript) that uses Prisma as ORM and follows a modular architecture.
The goal of this file is to give concise, actionable rules and code pointers so an AI can be productive immediately.

Key facts (short):

- Framework: NestJS (v11). Entry: `src/main.ts` (global pipes, global prefix `api/v1`, Swagger at `/api/docs`).
- ORM: Prisma. Schema: `prisma/schema.prisma`. `PrismaModule` is global: `src/prisma/prisma.module.ts`.
- API envelope: every successful controller response is wrapped using `ApiResponseDto` + `GlobalMetaDto`.
  - Response envelope code: `src/common/dtos/api-response.dto.ts` and the `ResponseInterceptor` at `src/common/interceptors/response/response.interceptor.ts`.
  - X-Request-Id is set/read; meta includes `requestId`, `timestamp`, `apiVersion`, `durationMs`.
- Errors follow Problem Details (`application/problem+json`) implemented by `GlobalExceptionFilter` in `src/common/filters/global-exception/global-exception.filter.ts` and `ProblemDetailsDto`.
- Authorization: custom `@Auth(...)` decorator and role enums. See `src/modules/auth/decorators` and `src/modules/auth/interfaces/valid-roles`.

Conventions to follow (concrete):

- Use the standard envelope for all controllers. Prefer the provided swagger helpers for docs:
  - `ApiOkResponseData`, `ApiCreatedResponseData`, `ApiOkResponsePaginated` located in `src/common/swagger/decorators/api-success-responses.decorator.ts`.
  - Error docs with `ApiErrorResponsesConfig` in `src/common/swagger/decorators/api-error-responses.decorator.ts`.
- Add per-handler success messages using `@SuccessMessage('<text>')` (see `src/common/decorators/success-messages.decorator.ts`). The `ResponseInterceptor` will pick it up.
- Global prefix: endpoints are mounted under `/api/v1` (set in `src/main.ts`). When writing examples or instances in docs, include that prefix.
- Validation: controllers rely on Nest `ValidationPipe` with { whitelist: true, forbidNonWhitelisted: true, transform: true } (configured in `src/main.ts`). Use DTOs with class-validator decorators.
- Soft-delete: most models have a `deleted: Boolean` column and code uses soft-delete patterns (example: `Usuario` model in `prisma/schema.prisma`, `users.controller.ts` softDelete/restore routes). When adding queries, respect `deleted` where appropriate.
- ID types: DB models use `Int` primary keys. Controllers commonly use `@Param('id', ParseIntPipe) id: number`.

Developer workflows & important commands (Windows / pwsh):

- Install deps (repo uses pnpm lock; either pnpm or npm works):

```pwsh
pnpm install
# or
npm install
```

- Generate Prisma client (postinstall runs this automatically):

```pwsh
npx prisma generate
```

- Run dev server (watch mode):

```pwsh
npm run start:dev
```

- Build and run production bundle:

```pwsh
npm run build
npm start
```

- Database migrations and dev flow (create/apply):

```pwsh
npx prisma migrate dev --name descriptive_name
npx prisma generate
```

- Seed the DB (script included):

```pwsh
npm run seed
```

- Tests & lint:

```pwsh
npm run test
npm run test:e2e
npm run lint
npm run format
```

Environment variables the agent should assume are in use:

- `DATABASE_URL` (Prisma), `API_VERSION` (optional, used by ResponseInterceptor), `ERRORS_BASE_URL` (optional, used by GlobalExceptionFilter), `PORT`.

Files and locations to inspect when making changes (high value):

- Response & success flow: `src/common/interceptors/response/response.interceptor.ts`, `src/common/decorators/success-messages.decorator.ts`, `src/common/dtos/api-response.dto.ts`.
- Error handling: `src/common/filters/global-exception/global-exception.filter.ts` and handlers under `src/common/handlers/*` (Prisma handlers live here).
- Swagger docs helpers: `src/common/swagger/decorators/*.ts` (use these, do not hand-craft swagger schemas for the standard envelope).
- Prisma and DB: `prisma/schema.prisma`, migrations in `prisma/migrations/`, seed code in `prisma/seed/`.
- Module pattern: each feature under `src/modules/<feature>` has controller, service, dto, entities. Use `PrismaService` (global) for DB access.

Minimal contract for implementing an endpoint (what to return / error behavior):

- Input: DTO validated by class-validator. Controller handlers should accept typed DTOs (transform enabled).
- Success output: return the raw resource (or paginated object) and let `ResponseInterceptor` wrap it into ApiResponseDto.
- Errors: throw HttpException or Prisma errors; GlobalExceptionFilter maps these into Problem Details.

Examples (copy/paste friendly imports):

- Use success message + swagger helper on a POST route:
  - imports: `import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';` and `import { ApiCreatedResponseData } from 'src/common/swagger/decorators/api-success-responses.decorator';`
  - decorator usage in controllers: `@SuccessMessage('Usuario creado correctamente')` and `@ApiCreatedResponseData(ResponseUserDto, undefined, 'Usuario creado correctamente', true)`.

Edge-cases and gotchas for AI agents (observed patterns):

- Many handlers expect numeric ids; remember ParseIntPipe and number types.
- The API wrapper always emits meta with `requestId` and `durationMs`. Tests or mocks that assert raw JSON must account for envelope.
- Error responses use RFC7807 Problem Details (`application/problem+json`), not the envelope. Do not try to wrap errors into ApiResponseDto.
- When modifying DB schema, run `prisma migrate` and `prisma generate`, and update any seed/migration SQL in `prisma/migrations/`.

When in doubt, reference these files first:

- `src/main.ts`
- `src/common/interceptors/response/response.interceptor.ts`
- `src/common/filters/global-exception/global-exception.filter.ts`
- `src/common/dtos/api-response.dto.ts`
- `src/common/swagger/decorators/api-success-responses.decorator.ts`
- `prisma/schema.prisma`

If any section here is ambiguous or you want examples for a particular change (new module, endpoint, migration), tell me which type of change and I'll expand with a small scaffold or tests.
