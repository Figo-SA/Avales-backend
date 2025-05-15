import { Prisma } from '@prisma/client';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionHandler } from './base-exception.handler';

export class PrismaKnownErrorHandler implements BaseExceptionHandler {
  canHandle(exception: any): boolean {
    return exception instanceof Prisma.PrismaClientKnownRequestError;
  }

  handle(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === 'P2002') {
      response.status(400).json({
        message: `Ya existe un registro con el campo único: ${exception.meta?.target}`,
      });
    } else {
      response.status(400).json({
        message: 'Error de base de datos (conocido)',
        code: exception.code,
      });
    }
  }
}
