import { Prisma } from '@prisma/client';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionHandler } from './base-exception.handler';

export class PrismaUnknownErrorHandler implements BaseExceptionHandler {
  canHandle(exception: unknown): boolean {
    return exception instanceof Prisma.PrismaClientUnknownRequestError;
  }

  handle(
    exception: Prisma.PrismaClientUnknownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const message = exception?.message || 'Error interno del servidor';
    const error = exception?.name || 'InternalServerError';

    return {
      status: 'error',
      message,
      error,
      timestamp: new Date().toLocaleString(),
      path: request.url,
      data: null,
    };
  }
}
