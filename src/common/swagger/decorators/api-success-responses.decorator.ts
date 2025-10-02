// src/common/swagger/api-response-helpers.ts
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiCreatedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiResponseDto,
  GlobalMetaDto,
} from 'src/common/dtos/api-response.dto';

// 200 OK con envelope estándar. includeMeta = true si quieres que aparezca en el schema.
export function ApiOkResponseData<TModel extends Type<any>>(
  model: TModel,
  example?: any,
  message = 'Operación completada correctamente',
  includeMeta = false,
) {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, model),
    ApiOkResponse({
      description: 'Respuesta exitosa estándar',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  message: { type: 'string', example: message },
                  ...(includeMeta
                    ? { meta: { $ref: getSchemaPath(GlobalMetaDto) } }
                    : {}),
                  data: { $ref: getSchemaPath(model) },
                },
              },
            ],
          },
          ...(example && {
            examples: {
              default: {
                summary: 'Ejemplo de respuesta exitosa',
                value: example,
              },
            },
          }),
        },
      },
    }),
  );
}

export function ApiCreatedResponseData<TModel extends Type<any>>(
  model: TModel,
  example?: any,
  message = 'Recurso creado correctamente',
  includeMeta = false,
) {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, model),
    ApiCreatedResponse({
      description: 'Creación exitosa',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  message: { type: 'string', example: message },
                  ...(includeMeta
                    ? { meta: { $ref: getSchemaPath(GlobalMetaDto) } }
                    : {}),
                  data: { $ref: getSchemaPath(model) },
                },
              },
            ],
          },
          ...(example && {
            examples: {
              default: {
                summary: 'Ejemplo de creación exitosa',
                value: example,
              },
            },
          }),
        },
      },
    }),
  );
}

/**
 * 200 OK paginado con envelope estándar.
 * includeMeta = true para que "meta" aparezca en el schema.
 */
export function ApiOkResponsePaginated<TItem extends Type<any>>(
  itemModel: TItem,
  example?: any,
  message = 'Datos obtenidos correctamente',
  includeMeta = false,
) {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, itemModel),
    ApiOkResponse({
      description: 'Lista paginada exitosa',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  message: { type: 'string', example: message },
                  ...(includeMeta
                    ? { meta: { $ref: getSchemaPath(GlobalMetaDto) } }
                    : {}),
                  data: {
                    type: 'object',
                    properties: {
                      items: {
                        type: 'array',
                        items: { $ref: getSchemaPath(itemModel) },
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          total: { type: 'number', example: 7 },
                          page: { type: 'number', example: 1 },
                          limit: { type: 'number', example: 5 },
                          lastPage: { type: 'number', example: 2 },
                          hasNext: { type: 'boolean', example: true },
                          hasPrev: { type: 'boolean', example: false },
                        },
                        required: [
                          'total',
                          'page',
                          'limit',
                          'lastPage',
                          'hasNext',
                          'hasPrev',
                        ],
                      },
                    },
                    required: ['items', 'pagination'],
                  },
                },
              },
            ],
          },
          ...(example && {
            examples: {
              default: {
                summary: 'Ejemplo de respuesta paginada',
                value: example,
              },
            },
          }),
        },
      },
    }),
  );
}
