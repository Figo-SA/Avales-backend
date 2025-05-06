// prisma-validation-error.handler.ts
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseExceptionHandler } from './base-exception.handler';
import { Response } from 'express';

export class PrismaValidationErrorHandler implements BaseExceptionHandler {
  canHandle(exception: unknown): boolean {
    return exception instanceof Prisma.PrismaClientValidationError;
  }

  handle(
    exception: Prisma.PrismaClientValidationError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      status: 'error',
      message: exception.message,
      error: 'PrismaClientValidationError',
      timestamp: new Date().toISOString(),
      data: null,
    });
  }
}
