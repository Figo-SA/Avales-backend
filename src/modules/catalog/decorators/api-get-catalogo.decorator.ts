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
import { CatalogoDto } from '../dto/catalogo.dto';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';

export function ApiGetCatalog() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene el catálogo completo del sistema',
      description: `
Retorna todas las **categorías** y **disciplinas** del sistema.

- Endpoint **solo lectura**
- Datos de referencia (catálogo)
- No requiere autenticación
- Ideal para formularios y selects

**Nota:** Estos datos cambian muy raramente (≈ cada 2 años)
      `.trim(),
    }),
    SuccessMessage('Catálogo obtenido correctamente'),
    ApiExtraModels(ApiResponseDto, GlobalMetaDto, CatalogoDto),
    ApiOkResponse({
      description: 'Catálogo obtenido correctamente',
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseDto) },
              {
                properties: {
                  message: { type: 'string' },
                  meta: { $ref: getSchemaPath(GlobalMetaDto) },
                  data: { $ref: getSchemaPath(CatalogoDto) },
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
