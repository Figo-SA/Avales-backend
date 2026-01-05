import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
  ApiOkResponsePaginated,
} from 'src/common/swagger/decorators/api-success-responses.decorator';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';
import { AthleteResponseDto } from '../dto/athlete-response.dto';
import { DeletedResourceDto } from 'src/common/dtos/deleted-resource.dto';

/**
 * Decorador para el endpoint de listado de atletas (paginado y filtrable)
 */
export function ApiGetAthletes() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar atletas (filtrable y paginado)',
      description: `
Retorna una lista paginada de atletas con filtros opcionales.

Parámetros de paginación:
- page: Número de página (default: 1)
- limit: Cantidad de registros por página (default: 50)

Filtros disponibles:
- genero: Filtrar por género (MASCULINO/FEMENINO)
- query: Buscar por nombres, apellidos o cédula
- soloAfiliados: Solo atletas afiliados (default: true)
      `.trim(),
    }),
    SuccessMessage('Atletas obtenidos exitosamente'),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Página (default: 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Resultados por página (default: 50)',
    }),
    ApiQuery({
      name: 'genero',
      required: false,
      description: 'Filtrar por género (MASCULINO/FEMENINO)',
    }),
    ApiQuery({
      name: 'query',
      required: false,
      description: 'Buscar por nombres, apellidos o cédula',
    }),
    ApiQuery({
      name: 'soloAfiliados',
      required: false,
      type: Boolean,
      description: 'Solo atletas afiliados (default: true)',
    }),
    ApiOkResponsePaginated(
      AthleteResponseDto,
      undefined,
      'Atletas obtenidos exitosamente',
    ),
    ApiErrorResponsesConfig([401, 403, 500]),
  );
}

/**
 * Decorador para el endpoint de búsqueda por cédula
 */
export function ApiGetAthleteByCedula() {
  return applyDecorators(
    ApiOperation({ summary: 'Buscar atleta por cédula' }),
    SuccessMessage('Atleta encontrado'),
    ApiQuery({ name: 'cedula', required: true, description: 'Cédula del atleta' }),
    ApiOkResponseData(AthleteResponseDto, undefined, 'Atleta encontrado'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un atleta con esa cédula',
        instance: '/api/v1/athletes/search/cedula',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de obtener atleta por ID
 */
export function ApiGetAthlete() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener atleta por ID' }),
    SuccessMessage('Atleta obtenido exitosamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del atleta' }),
    ApiOkResponseData(AthleteResponseDto, undefined, 'Atleta obtenido exitosamente'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un atleta con ese ID',
        instance: '/api/v1/athletes/{id}',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de creación de atleta
 */
export function ApiCreateAthlete() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear atleta',
      description: `
Crea un nuevo atleta en el sistema.

Validaciones:
- La cédula debe ser única
- La categoría (categoriaId) debe existir
- La disciplina (disciplinaId) debe existir
- Si afiliacion es true, se calcula automáticamente la fecha de fin (1 año)
      `.trim(),
    }),
    SuccessMessage('Atleta creado exitosamente'),
    ApiCreatedResponseData(AthleteResponseDto, undefined, 'Atleta creado exitosamente'),
    ApiErrorResponsesConfig([400, 401, 403, 409, 422, 500], {
      409: {
        type: 'https://api.tu-dominio.com/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: 'Ya existe un atleta con esa cédula',
        instance: '/api/v1/athletes',
      },
      422: {
        type: 'https://api.tu-dominio.com/errors/unprocessable-entity',
        title: 'Unprocessable Entity',
        status: 422,
        detail: 'Categoría o disciplina no encontrada',
        instance: '/api/v1/athletes',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de actualización de atleta
 */
export function ApiUpdateAthlete() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar atleta',
      description: `
Actualiza los datos de un atleta existente.

Validaciones:
- El atleta debe existir y no estar eliminado
- La cédula debe ser única (si se actualiza)
- La categoría y disciplina deben existir (si se actualizan)
- Si cambia el estado de afiliación, se recalculan las fechas
      `.trim(),
    }),
    SuccessMessage('Atleta actualizado exitosamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del atleta' }),
    ApiOkResponseData(AthleteResponseDto, undefined, 'Atleta actualizado exitosamente'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 409, 422, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un atleta con ese ID',
        instance: '/api/v1/athletes/{id}',
      },
      409: {
        type: 'https://api.tu-dominio.com/errors/conflict',
        title: 'Conflict',
        status: 409,
        detail: 'Ya existe otro atleta con esa cédula',
        instance: '/api/v1/athletes/{id}',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de soft delete
 */
export function ApiDeleteAthlete() {
  return applyDecorators(
    ApiOperation({ summary: 'Eliminar atleta (soft delete)' }),
    SuccessMessage('Atleta eliminado exitosamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del atleta' }),
    ApiOkResponseData(DeletedResourceDto, undefined, 'Atleta eliminado exitosamente'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un atleta con ese ID o ya fue eliminado',
        instance: '/api/v1/athletes/{id}',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de restauración
 */
export function ApiRestoreAthlete() {
  return applyDecorators(
    ApiOperation({ summary: 'Restaurar atleta eliminado' }),
    SuccessMessage('Atleta restaurado exitosamente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del atleta' }),
    ApiOkResponseData(AthleteResponseDto, undefined, 'Atleta restaurado exitosamente'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un atleta eliminado con ese ID',
        instance: '/api/v1/athletes/{id}/restore',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de eliminación permanente
 */
export function ApiHardDeleteAthlete() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar atleta permanentemente',
      description: 'Elimina el atleta de forma permanente. Solo se puede eliminar si ya fue marcado como eliminado (soft delete).',
    }),
    SuccessMessage('Atleta eliminado permanentemente'),
    ApiParam({ name: 'id', type: Number, description: 'ID del atleta' }),
    ApiOkResponseData(DeletedResourceDto, undefined, 'Atleta eliminado permanentemente'),
    ApiErrorResponsesConfig([400, 401, 403, 404, 500], {
      404: {
        type: 'https://api.tu-dominio.com/errors/not-found',
        title: 'Not Found',
        status: 404,
        detail: 'No existe un atleta eliminado con ese ID',
        instance: '/api/v1/athletes/{id}/permanent',
      },
    }),
  );
}
