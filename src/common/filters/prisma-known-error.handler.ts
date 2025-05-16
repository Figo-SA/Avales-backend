// prisma-known-error.handler.ts
import { Prisma } from '@prisma/client';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionHandler } from './base-exception.handler';
import { error } from 'console';

export class PrismaKnownErrorHandler implements BaseExceptionHandler {
  canHandle(exception: any): boolean {
    return exception instanceof Prisma.PrismaClientKnownRequestError;
  }

  handle(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    switch (exception.code) {
      case 'P2002':
        response.status(HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: `Ya existe un registro con el campo único: ${exception.meta?.target}`,
          error: exception.name,
          timestamp: new Date().toLocaleString(),
          path: request.url,
          data: null,
        });
        break;

      case 'P2025':
        response.status(HttpStatus.NOT_FOUND).json({
          status: 'error',
          message: `El recurso no fue encontrado o ya fue eliminado.`,
          error: exception.name,
          timestamp: new Date().toLocaleString(),
          path: request.url,
          data: null,
        });
        break;

      default:
        response.status(HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: 'Error de base de datos (conocido)',
          error: exception.name,
          timestamp: new Date().toLocaleString(),
          path: request.url,
          data: null,
        });
    }
  }
}
