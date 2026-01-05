import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiExtraModels,
  ApiOkResponse,
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