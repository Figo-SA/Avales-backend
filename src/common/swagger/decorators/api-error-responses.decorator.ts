// api-error-responses-config.ts
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ProblemDetailsDto } from 'src/common/dtos/problem-details.dto';

type StatusKey = 400 | 401 | 403 | 404 | 409 | 422 | 500;

type ErrorSpec = {
  status: StatusKey;
  description: string;
  title: string; // título por defecto para el status
  detail: string; // detalle por defecto para el status
};

const DEFAULTS: Record<StatusKey, ErrorSpec> = {
  400: {
    status: 400,
    description: 'Bad Request (validación/parseo)',
    title: 'Bad Request',
    detail: 'La solicitud es inválida o no cumple validaciones.',
  },
  401: {
    status: 401,
    description: 'Unauthorized',
    title: 'Unauthorized',
    detail: 'No autenticado o token inválido/expirado.',
  },
  403: {
    status: 403,
    description: 'Forbidden',
    title: 'Forbidden',
    detail: 'No tiene permisos para realizar esta acción.',
  },
  404: {
    status: 404,
    description: 'Not Found',
    title: 'Not Found',
    detail: 'El recurso solicitado no existe.',
  },
  409: {
    status: 409,
    description: 'Conflict',
    title: 'Conflict',
    detail: 'Existe un conflicto con el estado actual del recurso.',
  },
  422: {
    status: 422,
    description: 'Unprocessable Entity (reglas de dominio/validación avanzada)',
    title: 'Unprocessable Entity',
    detail:
      'La solicitud es válida pero no se puede procesar por reglas de dominio.',
  },
  500: {
    status: 500,
    description: 'Internal Server Error',
    title: 'Internal Server Error',
    detail: 'Se produjo un error inesperado en el servidor.',
  },
};

type PartialProblem = Partial<ProblemDetailsDto> & Record<string, any>;

/**
 * Permite pasar examples parciales por status (los fusiona con los defaults).
 * - Si NO pasas examples para un status, se generan por defecto (title/detail coherentes).
 * - Si SÍ pasas example para un status, se hace merge con los defaults.
 */
export function ApiErrorResponsesConfig(
  statuses: StatusKey[],
  examples?: Partial<Record<StatusKey, PartialProblem>>,
) {
  const makeDefaultExample = (s: StatusKey): ProblemDetailsDto => {
    const d = DEFAULTS[s];
    return {
      type: `https://api.com/errors/${String(d.title).toLowerCase().replace(/\s+/g, '-')}`,
      title: d.title,
      status: d.status,
      detail: d.detail,
      instance: `/api/v1/{RUTA}`, // si quieres, cámbialo en cada uso o déjalo genérico
      requestId: '9c0e-...-3800',
      apiVersion: 'v1',
      durationMs: 0,
    } as ProblemDetailsDto;
  };

  const responses = statuses.map((s) => {
    const base = makeDefaultExample(s);
    const override = (examples && examples[s]) || {};
    const value = { ...base, ...override, status: s }; // forzamos status correcto

    return ApiResponse({
      status: s,
      description: DEFAULTS[s].description,
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(ProblemDetailsDto) },
          examples: {
            default: {
              summary: DEFAULTS[s].title,
              value,
            },
          },
        },
      },
    });
  });

  return applyDecorators(ApiExtraModels(ProblemDetailsDto), ...responses);
}
