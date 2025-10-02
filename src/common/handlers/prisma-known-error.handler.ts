// src/common/filters/handlers/prisma-known-error.handler.ts
import { Prisma } from '@prisma/client';
import { BaseExceptionHandler, ProblemShape } from './base-exception.handler';
import { buildType } from '../herlpers/problem-details';

export class PrismaKnownErrorHandler extends BaseExceptionHandler {
  canHandle(e: unknown): boolean {
    return e instanceof Prisma.PrismaClientKnownRequestError;
  }

  toProblem(
    e: Prisma.PrismaClientKnownRequestError,
    errorBase: string,
  ): ProblemShape {
    switch (e.code) {
      case 'P2002':
        return {
          status: 409,
          title: 'Conflict',
          type: buildType(errorBase, 'unique_constraint_violation'),
          detail: 'El valor para un campo único ya está en uso.',
        };
      case 'P2025':
        return {
          status: 404,
          title: 'Not Found',
          type: buildType(errorBase, 'resource_not_found'),
          detail: 'El recurso especificado no fue encontrado.',
        };
      default:
        return {
          status: 400,
          title: 'Bad Request',
          type: buildType(errorBase, 'prisma_request_error'),
          detail: e.message,
        };
    }
  }
}
