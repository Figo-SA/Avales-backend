import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
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

  catch(exception: T, host: ArgumentsHost) {
    const handler = this.handlers.find((handler) =>
      handler.canHandle(exception),
    );

    if (handler) {
      handler.handle(exception, host);
    } else {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      response
        .status(500)
        .json({ message: 'Unexpected error occurred', error: exception });
    }
  }
}
