// src/common/filters/handlers/default-error.handler.ts
import { buildType } from '../herlpers/problem-details';
import { BaseExceptionHandler, ProblemShape } from './base-exception.handler';

export class DefaultErrorHandler extends BaseExceptionHandler {
  canHandle(e: unknown): boolean {
    return e instanceof Error;
  }

  toProblem(e: Error, errorBase: string): ProblemShape {
    return {
      status: 500,
      title: 'Internal Server Error',
      type: buildType(errorBase, 'unhandled_error'),
      detail: e.message || 'Error interno del servidor',
    };
  }
}
