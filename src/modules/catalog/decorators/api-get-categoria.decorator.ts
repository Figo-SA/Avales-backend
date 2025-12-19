import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import {
  ApiResponseDto,
  GlobalMetaDto,
} from 'src/common/dtos/api-response.dto';
import { CatalogoItemDto } from '../dto/catalogo-item.dto';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';

export function ApiGetCategorias() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene el listado de categorías',
      description: `
Retorna todas las categorías del sistema.

- Endpoint **solo lectura**
- Ideal para selects
- Datos estáticos de referencia
      `.trim(),
    }),
    SuccessMessage('Categorías obtenidas correctamente'),
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, CatalogoItemDto),
    ApiOkResponse({
      description: 'Categorías obtenidas correctamente',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(CatalogoItemDto) },
                  },
                },
              },
            ],
          },
        },
      },
    }),
    ApiErrorResponsesConfig([500]),
  );
}
