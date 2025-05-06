// http-error.handler.ts
import { ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionHandler } from './base-exception.handler';
import { Response } from 'express';

export class HttpErrorHandler implements BaseExceptionHandler {
  canHandle(exception: unknown): boolean {
    return exception instanceof HttpException;
  }

  handle(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message;

    response.status(status).json({
      status: 'error',
      message,
      error: exception.name,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: null,
    });
  }
}
