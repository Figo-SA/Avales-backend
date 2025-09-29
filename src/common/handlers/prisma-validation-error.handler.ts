// src/common/filters/handlers/prisma-validation-error.handler.ts
import { Prisma } from '@prisma/client';
import { BaseExceptionHandler, ProblemShape } from './base-exception.handler';
import { buildType } from '../herlpers/problem-details';

export class PrismaValidationErrorHandler extends BaseExceptionHandler {
  canHandle(e: unknown): boolean {
    return e instanceof Prisma.PrismaClientValidationError;
  }

  toProblem(
    e: Prisma.PrismaClientValidationError,
    errorBase: string,
  ): ProblemShape {
    return {
      status: 400,
      title: 'Bad Request',
      type: buildType(errorBase, 'prisma_validation_error'),
      detail: 'La consulta enviada no es válida.',
      extensions: { rawMessage: e.message }, // opcional, quítalo si no quieres filtrar
    };
  }
}
