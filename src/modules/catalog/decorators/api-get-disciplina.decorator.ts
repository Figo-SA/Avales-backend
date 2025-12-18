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

export function ApiGetDisciplina() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene el listado de disciplinas',
      description: `
Retorna todas las disciplinas del sistema.

- Endpoint **solo lectura**
- Ideal para selects
- Datos estáticos de referencia
      `.trim(),
    }),
    SuccessMessage('disciplinas obtenidas correctamente'),
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, CatalogoItemDto),
    ApiOkResponse({
      description: 'disciplinas obtenidas correctamente',
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
