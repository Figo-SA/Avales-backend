// src/common/filters/handlers/prisma-unknown-error.handler.ts
import { Prisma } from '@prisma/client';
import { BaseExceptionHandler, ProblemShape } from './base-exception.handler';
import { buildType } from '../herlpers/problem-details';

export class PrismaUnknownErrorHandler extends BaseExceptionHandler {
  canHandle(e: unknown): boolean {
    return e instanceof Prisma.PrismaClientUnknownRequestError;
  }

  toProblem(
    _e: Prisma.PrismaClientUnknownRequestError,
    errorBase: string,
  ): ProblemShape {
    return {
      status: 500,
      title: 'Internal Server Error',
      type: buildType(errorBase, 'prisma_unknown_request_error'),
      detail: 'Error de base de datos no especificado.',
    };
  }
}
