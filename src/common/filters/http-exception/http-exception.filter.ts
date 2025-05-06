import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error = 'Internal Server Error';

    // Prisma errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      error = 'PrismaClientKnownRequestError';

      switch (exception.code) {
        case 'P2002':
          message = `El valor para el campo único ya está en uso`;
          break;
        case 'P2025':
          message = `El recurso especificado no fue encontrado`;
          status = HttpStatus.NOT_FOUND;
          break;
        default:
          message = exception.message;
      }
    }

    // Prisma transaction or unknown request errors
    else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'PrismaClientUnknownRequestError';
      message = exception.message;
    }

    // Prisma validation error
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      error = 'PrismaClientValidationError';
      message = exception.message;
    }

    // NestJS HttpException (NotFound, BadRequest, etc.)
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
      error = exception.name;
    }

    // Otros errores no manejados (error interno)
    else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    response.status(status).json({
      status: 'error',
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: null,
    } as ApiResponseDto<null>);
  }
}
