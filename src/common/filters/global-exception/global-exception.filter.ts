// src/common/filters/global-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { PrismaKnownErrorHandler } from 'src/common/handlers/prisma-known-error.handler';
import { PrismaUnknownErrorHandler } from 'src/common/handlers/prisma-unknown-error.handler';
import { PrismaValidationErrorHandler } from 'src/common/handlers/prisma-validation-error.handler';
import { HttpErrorHandler } from 'src/common/handlers/http-error.handler';
import { DefaultErrorHandler } from 'src/common/handlers/default-error.handler';
import { AuthExceptionHandler } from 'src/common/handlers/auth-exception.handler';
import { BaseExceptionHandler } from 'src/common/handlers/base-exception.handler';
import {
  normalizeRequestId,
  ProblemDetails,
} from 'src/common/herlpers/problem-details';
import { ProblemDetailsDto } from 'src/common/dtos/problem-details.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly apiVersion = process.env.API_VERSION ?? 'v1';
  private readonly errorBase =
    process.env.ERRORS_BASE_URL ?? 'https://api.tu-dominio.com/errors';

  private handlers: BaseExceptionHandler[] = [
    new AuthExceptionHandler(), // ← Debe ir ANTES de HttpErrorHandler
    new PrismaKnownErrorHandler(),
    new PrismaUnknownErrorHandler(),
    new PrismaValidationErrorHandler(),
    new HttpErrorHandler(),
    new DefaultErrorHandler(), // fallback para Error genérico
  ];

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const requestId = normalizeRequestId(
      req.headers['x-request-id'],
      randomUUID(),
    );
    const instance = req.originalUrl || req.url;

    // Si tienes un TimingMiddleware para duración:
    const durationMs = (req as any)._hrStart
      ? Math.round(
          Number(process.hrtime.bigint() - (req as any)._hrStart) / 1_000_000,
        )
      : undefined;

    // 1) Mapea la excepción al shape Problem
    const shape = this.toProblemShape(exception);

    // 2) Ensambla Problem Details + extensiones
    const problem: ProblemDetails = {
      type: shape.type,
      title: shape.title,
      status: shape.status,
      detail: shape.detail,
      instance,
      requestId, // extensión útil
      apiVersion: this.apiVersion, // extensión útil
      ...(durationMs !== undefined ? { durationMs } : {}),
      ...(shape.extensions ?? {}),
    };

    res.status(shape.status).type('application/problem+json').json(problem);
  }

  private toProblemShape(exception: unknown) {
    for (const h of this.handlers) {
      if (h.canHandle(exception)) {
        return h.toProblem(exception as any, this.errorBase);
      }
    }
    // Nunca debería llegar; DefaultErrorHandler cubre Error
    return new DefaultErrorHandler().toProblem(
      exception as Error,
      this.errorBase,
    );
  }
}
