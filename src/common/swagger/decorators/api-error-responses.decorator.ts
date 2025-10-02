import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ProblemDetailsDto } from 'src/common/dtos/problem-details.dto';

type StatusKey = 400 | 401 | 403 | 404 | 409 | 422 | 500;

type ErrorSpec = {
  status: StatusKey;
  description: string;
  example?: any; // opcional: ejemplo específico
};

const DEFAULTS: Record<StatusKey, Omit<ErrorSpec, 'status'>> = {
  400: { description: 'Bad Request (validación/parseo)' },
  401: { description: 'Unauthorized' },
  403: { description: 'Forbidden' },
  404: { description: 'Not Found' },
  409: { description: 'Conflict' },
  422: {
    description: 'Unprocessable Entity (reglas de dominio/validación avanzada)',
  },
  500: { description: 'Internal Server Error' },
};

export function ApiErrorResponsesConfig(
  statuses: StatusKey[],
  examples?: Partial<Record<StatusKey, any>>,
) {
  const responses = statuses.map((s) =>
    ApiResponse({
      status: s,
      description: DEFAULTS[s].description,
      content: {
        'application/json': {
          schema: { $ref: getSchemaPath(ProblemDetailsDto) },
          ...(examples?.[s] && {
            examples: { example: { value: examples[s] } },
          }),
        },
      },
    }),
  );

  return applyDecorators(ApiExtraModels(ProblemDetailsDto), ...responses);
}
