import { Prisma } from '@prisma/client';
import { HttpStatus } from '@nestjs/common';
import { BaseExceptionHandler } from './base-exception.handler';

export class PrismaUnknownErrorHandler implements BaseExceptionHandler {
  canHandle(exception: unknown): boolean {
    return exception instanceof Prisma.PrismaClientUnknownRequestError;
  }

  handle(exception: Prisma.PrismaClientUnknownRequestError) {
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
      error: 'PrismaClientUnknownRequestError',
    };
  }
}
