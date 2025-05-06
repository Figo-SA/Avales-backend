// default-error.handler.ts
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionHandler } from './base-exception.handler';
import { Response } from 'express';

export class DefaultErrorHandler implements BaseExceptionHandler {
  canHandle(exception: unknown): boolean {
    return true; // catch-all fallback
  }

  handle(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const message = exception?.message || 'Error interno del servidor';
    const error = exception?.name || 'InternalServerError';

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: null,
    });
  }
}
