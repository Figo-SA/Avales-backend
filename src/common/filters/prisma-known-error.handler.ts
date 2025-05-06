import { Prisma } from '@prisma/client';
import { HttpStatus } from '@nestjs/common';
import { BaseExceptionHandler } from './base-exception.handler';

export class PrismaKnownErrorHandler implements BaseExceptionHandler {
  canHandle(exception: unknown): boolean {
    return exception instanceof Prisma.PrismaClientKnownRequestError;
  }

  handle(exception: Prisma.PrismaClientKnownRequestError) {
    let status = HttpStatus.BAD_REQUEST;
    let message = 'Error en la solicitud a la base de datos';

    switch (exception.code) {
      case 'P2002':
        message = 'El valor para un campo único ya está en uso.';
        break;
      case 'P2025':
        message = 'El recurso especificado no fue encontrado.';
        status = HttpStatus.NOT_FOUND;
        break;
      default:
        message = exception.message;
    }

    return {
      status,
      message,
      error: 'PrismaClientKnownRequestError',
    };
  }
}
