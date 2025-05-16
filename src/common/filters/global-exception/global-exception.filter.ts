import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionHandler } from '../base-exception.handler';
import { PrismaKnownErrorHandler } from '../prisma-known-error.handler';
import { PrismaUnknownErrorHandler } from '../prisma-unknown-error.handler';
import { DefaultErrorHandler } from '../default-error.handler';
import { HttpErrorHandler } from '../http-error.handler';
import { PrismaValidationErrorHandler } from '../prisma-validation-error.handler';

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
  private handlers: BaseExceptionHandler[] = [
    new PrismaKnownErrorHandler(),
    new PrismaUnknownErrorHandler(),
    new DefaultErrorHandler(),
    new HttpErrorHandler(),
    new PrismaValidationErrorHandler(),
  ];

  catch(exception: any, host: ArgumentsHost): void {
    for (const handler of this.handlers) {
      if (handler.canHandle(exception)) {
        handler.handle(exception, host);
        return;
      }
    }

    // Fallback para errores no manejados
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Error interno del servidor';

    response.status(status).json({
      status: 'error',
      message,
    });
  }
}
