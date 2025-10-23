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
      case 'P2002': {
        // Extraer el campo que causó el conflicto
        const target = e.meta?.target as string[] | undefined;
        const field = target?.[0] || 'campo';

        // Mapeo de campos a mensajes amigables
        const fieldMessages: Record<string, string> = {
          email: 'El email ya está en uso por otro usuario.',
          cedula: 'La cédula ya está registrada en el sistema.',
          codigo: 'El código ya existe. Debe ser único.',
        };

        const detail =
          fieldMessages[field] ||
          `El valor para el campo '${field}' ya está en uso.`;

        return {
          status: 409,
          title: 'Conflict',
          type: buildType(errorBase, 'unique_constraint_violation'),
          detail,
          extensions: {
            field,
            errorCode: `DUPLICATE_${field.toUpperCase()}`,
          },
        };
      }
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
