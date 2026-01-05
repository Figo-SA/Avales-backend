import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiExtraModels,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import {
  ApiResponseDto,
  GlobalMetaDto,
} from 'src/common/dtos/api-response.dto';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';
import { CatalogItemDto } from '../dto/catalog-item.dto';
import { CatalogResponseDto } from '../dto/catalog-response.dto';
import { ItemResponseDto } from '../dto/item-response.dto';

/**
 * Decorador para obtener el catálogo completo
 */
export function ApiGetCatalog() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener catálogo completo',
      description: `
Retorna todas las categorías y disciplinas del sistema.

Ideal para formularios y selects.
      `.trim(),
    }),
    SuccessMessage('Catálogo obtenido correctamente'),
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, CatalogResponseDto),
    ApiOkResponse({
      description: 'Catálogo obtenido correctamente',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  message: {
                    type: 'string',
                    example: 'Catálogo obtenido correctamente',
                  },
                  meta: { $ref: getSchemaPath(GlobalMetaDto) },
                  data: { $ref: getSchemaPath(CatalogResponseDto) },
                },
              },
            ],
          },
        },
      },
    }),
    ApiErrorResponsesConfig([401, 403, 500]),
  );
}

/**
 * Decorador para obtener las categorías
 */
export function ApiGetCategorias() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener categorías',
      description: 'Retorna todas las categorías del sistema',
    }),
    SuccessMessage('Categorías obtenidas correctamente'),
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, CatalogItemDto),
    ApiOkResponse({
      description: 'Categorías obtenidas correctamente',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  message: {
                    type: 'string',
                    example: 'Categorías obtenidas correctamente',
                  },
                  meta: { $ref: getSchemaPath(GlobalMetaDto) },
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(CatalogItemDto) },
                  },
                },
              },
            ],
          },
        },
      },
    }),
    ApiErrorResponsesConfig([401, 403, 500]),
  );
}

/**
 * Decorador para obtener las disciplinas
 */
export function ApiGetDisciplinas() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener disciplinas',
      description: 'Retorna todas las disciplinas del sistema',
    }),
    SuccessMessage('Disciplinas obtenidas correctamente'),
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, CatalogItemDto),
    ApiOkResponse({
      description: 'Disciplinas obtenidas correctamente',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  message: {
                    type: 'string',
                    example: 'Disciplinas obtenidas correctamente',
                  },
                  meta: { $ref: getSchemaPath(GlobalMetaDto) },
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(CatalogItemDto) },
                  },
                },
              },
            ],
          },
        },
      },
    }),
    ApiErrorResponsesConfig([401, 403, 500]),
  );
}

/**
 * Decorador para obtener todos los items presupuestarios
 */
export function ApiGetItems() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener items presupuestarios',
      description: `
Retorna todos los items presupuestarios del sistema.

Permite filtrar por actividad usando el parámetro \`actividadId\`.
      `.trim(),
    }),
    ApiQuery({
      name: 'actividadId',
      required: false,
      type: Number,
      description: 'Filtrar por ID de actividad',
      example: 1,
    }),
    SuccessMessage('Items obtenidos correctamente'),
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, ItemResponseDto),
    ApiOkResponse({
      description: 'Items obtenidos correctamente',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  message: {
                    type: 'string',
                    example: 'Items obtenidos correctamente',
                  },
                  meta: { $ref: getSchemaPath(GlobalMetaDto) },
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(ItemResponseDto) },
                  },
                },
              },
            ],
          },
        },
      },
    }),
    ApiErrorResponsesConfig([401, 403, 500]),
  );
}

/**
 * Decorador para obtener un item presupuestario por ID
 */
export function ApiGetItem() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener item presupuestario por ID',
      description: 'Retorna un item presupuestario específico con su actividad asociada',
    }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'ID del item',
      example: 1,
    }),
    SuccessMessage('Item obtenido correctamente'),
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, ItemResponseDto),
    ApiOkResponse({
      description: 'Item obtenido correctamente',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  message: {
                    type: 'string',
                    example: 'Item obtenido correctamente',
                  },
                  meta: { $ref: getSchemaPath(GlobalMetaDto) },
                  data: { $ref: getSchemaPath(ItemResponseDto) },
                },
              },
            ],
          },
        },
      },
    }),
    ApiErrorResponsesConfig([401, 403, 404, 500]),
  );
}

/**
 * Decorador para obtener todas las actividades
 */
export function ApiGetActividades() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener actividades',
      description: 'Retorna todas las actividades presupuestarias del sistema',
    }),
    SuccessMessage('Actividades obtenidas correctamente'),
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, CatalogItemDto),
    ApiOkResponse({
      description: 'Actividades obtenidas correctamente',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  message: {
                    type: 'string',
                    example: 'Actividades obtenidas correctamente',
                  },
                  meta: { $ref: getSchemaPath(GlobalMetaDto) },
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(CatalogItemDto) },
                  },
                },
              },
            ],
          },
        },
      },
    }),
    ApiErrorResponsesConfig([401, 403, 500]),
  );
}