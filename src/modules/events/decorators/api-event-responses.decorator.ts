import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponsePaginated,
} from 'src/common/swagger/decorators/api-success-responses.decorator';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';
import { EventResponseDto } from '../dto/event-response.dto';

/**
 * Decorador para el endpoint de creación de evento
 */
export function ApiCreateEvent() {
  return applyDecorators(
    ApiOperation({ summary: 'Crea un nuevo evento' }),
    ApiBody({
      schema: {
        type: 'object',
        required: [
          'codigo',
          'tipoParticipacion',
          'tipoEvento',
          'nombre',
          'lugar',
          'genero',
          'disciplinaId',
          'categoriaId',
          'provincia',
          'ciudad',
          'pais',
          'alcance',
          'fechaInicio',
          'fechaFin',
          'numEntrenadoresHombres',
          'numEntrenadoresMujeres',
          'numAtletasHombres',
          'numAtletasMujeres',
        ],
        properties: {
          codigo: { type: 'string', example: 'EV-TEST-001' },
          tipoParticipacion: { type: 'string', example: 'PARTICIPACION' },
          tipoEvento: { type: 'string', example: 'CAMPEONATO' },
          nombre: { type: 'string', example: 'Evento de Prueba' },
          lugar: { type: 'string', example: 'Estadio Central' },
          genero: {
            type: 'string',
            enum: ['MASCULINO', 'FEMENINO', 'MASCULINO_FEMENINO'],
            example: 'MASCULINO_FEMENINO',
          },
          disciplinaId: { type: 'integer', example: 1 },
          categoriaId: { type: 'integer', example: 1 },
          provincia: { type: 'string', example: 'Pichincha' },
          ciudad: { type: 'string', example: 'Quito' },
          pais: { type: 'string', example: 'Ecuador' },
          alcance: { type: 'string', example: 'NACIONAL' },
          fechaInicio: {
            type: 'string',
            format: 'date-time',
            example: '2025-12-01T08:00:00Z',
          },
          fechaFin: {
            type: 'string',
            format: 'date-time',
            example: '2025-12-05T18:00:00Z',
          },
          numEntrenadoresHombres: { type: 'integer', example: 2 },
          numEntrenadoresMujeres: { type: 'integer', example: 1 },
          numAtletasHombres: { type: 'integer', example: 10 },
          numAtletasMujeres: { type: 'integer', example: 8 },
          archivo: {
            type: 'string',
            format: 'binary',
            description: 'Archivo del evento (JPG, JPEG, PNG o PDF, max 5MB)',
          },
        },
      },
    }),
    SuccessMessage('Evento creado correctamente'),
    ApiCreatedResponseData(
      EventResponseDto,
      undefined,
      'Evento creado correctamente',
      true,
    ),
    ApiErrorResponsesConfig([400, 401, 403, 409, 422, 500], {
      409: {
        type: 'https://api.tu-dominio.com/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: 'El código del evento ya existe en el sistema.',
        instance: '/api/v1/events',
        apiVersion: 'v1',
      },
      422: {
        type: 'https://api.tu-dominio.com/errors/unprocessable-entity',
        title: 'Unprocessable Entity',
        status: 422,
        detail:
          'Reglas de dominio no cumplidas. Posibles causas: disciplina inexistente, categoría inexistente, o fechas inválidas.',
        instance: '/api/v1/events',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de listado de eventos
 */
export function ApiGetEvents() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene la lista de todos los eventos',
      description: `
Retorna todos los eventos registrados en el sistema.

**Nota:** Incluye información de disciplina y categoría relacionadas.
      `.trim(),
    }),
    SuccessMessage('Eventos obtenidos correctamente'),
    ApiOkResponseData(
      EventResponseDto,
      true,
      'Eventos obtenidos correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 403, 500]),
  );
}

/**
 * Decorador para el endpoint de listado paginado de eventos
 */
export function ApiGetEventsPaginated() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene la lista de eventos (paginado)',
      description: `
Retorna una lista paginada de eventos activos (no eliminados) del sistema.

**Parámetros de paginación:**
- page: Número de página (default: 1)
- limit: Cantidad de registros por página (default: 10, max: 100)

**Filtros disponibles:**
- estado: Filtrar por estado del evento (DISPONIBLE, SOLICITADO, RECHAZADO, ACEPTADO)
- search: Buscar por nombre, código, lugar, ciudad, provincia, tipo de evento o alcance (búsqueda case-insensitive)

**Ejemplos de búsqueda:**
- ?search=Nacional → Busca "Nacional" en nombre, código, lugar, etc.
- ?search=Quito → Busca eventos en Quito (ciudad o provincia)
- ?search=EV-FUT → Busca por código de evento
- ?estado=DISPONIBLE&search=Campeonato → Combina filtros

**Nota:** Solo retorna eventos con deleted=false, ordenados por fecha de inicio descendente.
      `.trim(),
    }),
    SuccessMessage('Eventos obtenidos correctamente (paginado)'),
    ApiOkResponsePaginated(
      EventResponseDto,
      undefined,
      'Eventos obtenidos correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 403, 500]),
  );
}

/**
 * Decorador para el endpoint de obtener un evento por ID
 */
export function ApiGetEvent() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene los detalles de un evento por ID',
      description: `
Retorna los detalles completos de un evento específico incluyendo disciplina y categoría.
      `.trim(),
    }),
    SuccessMessage('Evento obtenido correctamente'),
    ApiOkResponseData(
      EventResponseDto,
      undefined,
      'Evento obtenido correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un evento con ese id',
        instance: '/api/v1/events/{id}',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de actualización de evento
 */
export function ApiUpdateEvent() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar un evento',
      description: `
Actualiza los datos de un evento existente con las siguientes validaciones:

**Validaciones de unicidad:**
- El código debe ser único (exceptuando el evento actual)

**Validaciones de integridad referencial:**
- disciplinaId debe existir (si se proporciona)
- categoriaId debe existir (si se proporciona)

**Reglas de negocio:**
- Solo se actualizan los campos proporcionados (actualización parcial)
- Las fechas deben ser válidas (fechaFin >= fechaInicio)
      `.trim(),
    }),
    SuccessMessage('Evento actualizado correctamente'),
    ApiOkResponseData(
      EventResponseDto,
      undefined,
      'Evento actualizado correctamente',
      true,
    ),
    ApiErrorResponsesConfig([400, 401, 403, 404, 409, 422, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un evento con ese id',
        instance: '/api/v1/events/{id}',
        apiVersion: 'v1',
      },
      409: {
        type: 'https://api.tu-dominio.com/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: 'El código del evento ya está en uso por otro evento.',
        instance: '/api/v1/events/{id}',
        apiVersion: 'v1',
      },
      422: {
        type: 'https://api.tu-dominio.com/errors/unprocessable-entity',
        title: 'Unprocessable Entity',
        status: 422,
        detail:
          'Reglas de dominio no cumplidas. Posibles causas: disciplina inexistente o categoría inexistente.',
        instance: '/api/v1/events/{id}',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de eliminación de evento
 */
export function ApiDeleteEvent() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar un evento de forma permanente' }),
    SuccessMessage('Evento eliminado correctamente'),
    ApiOkResponseData(
      EventResponseDto,
      undefined,
      'Evento eliminado correctamente',
      true,
    ),
    ApiErrorResponsesConfig([401, 403, 404, 409, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un evento con ese id',
        instance: '/api/v1/events/{id}',
        apiVersion: 'v1',
      },
      409: {
        type: 'https://api.tu-dominio.com/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: 'No se puede eliminar: dependencias existentes',
        instance: '/api/v1/events/{id}',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de subir archivo a un evento
 */
export function ApiUploadEventFile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Subir archivo a un evento existente',
      description: `
Sube o reemplaza el archivo de un evento ya creado.

**Validaciones:**
- El evento debe existir
- Archivo requerido
- Tamaño máximo: 5MB
- Formatos permitidos: JPG, JPEG, PNG, PDF

**Comportamiento:**
- Si el evento ya tiene un archivo, se elimina el anterior y se sube el nuevo
- La URL del archivo se actualiza automáticamente en el evento
      `.trim(),
    }),
    ApiBody({
      schema: {
        type: 'object',
        required: ['archivo'],
        properties: {
          archivo: {
            type: 'string',
            format: 'binary',
            description: 'Archivo del evento (JPG, JPEG, PNG o PDF, max 5MB)',
          },
        },
      },
    }),
    SuccessMessage('Archivo subido correctamente'),
    ApiOkResponseData(
      EventResponseDto,
      undefined,
      'Archivo subido correctamente',
      true,
    ),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un evento con ese id',
        instance: '/api/v1/events/{id}/upload-file',
        apiVersion: 'v1',
      },
    }),
  );
}
