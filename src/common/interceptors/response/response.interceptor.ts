// response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../../dtos/api-response.dto';
import { SUCCESS_MESSAGE_KEY } from 'src/common/decorators/success-messages.decorator';
import { randomUUID } from 'crypto';

function normalizeRequestId(headerVal: string | string[] | undefined): string {
  if (Array.isArray(headerVal)) return headerVal[0] ?? randomUUID();
  return headerVal ?? randomUUID();
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  private readonly apiVersion = process.env.API_VERSION ?? 'v1';

  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const startedAt = process.hrtime.bigint(); // Convertir a ms
    const requestId = normalizeRequestId(
      request.headers['x-request-id'] as string | string[] | undefined,
    );

    response.setHeader('X-Request-Id', requestId);

    const defaultMessages: Record<string, string> = {
      GET: 'Datos obtenidos correctamente',
      POST: 'Recurso creado correctamente',
      PUT: 'Recurso actualizado correctamente',
      PATCH: 'Recurso actualizado correctamente',
      DELETE: 'Recurso eliminado correctamente',
    };

    const customMessage = this.reflector.get<string>(
      SUCCESS_MESSAGE_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((payload: T) => {
        const method = request.method.toUpperCase();
        const message =
          customMessage || defaultMessages[method] || 'Operación exitosa';

        const durationNs = Number(process.hrtime.bigint() - startedAt);
        const durationMs = Math.round(durationNs / 1_000_000);

        const responseBody: ApiResponseDto<T> = {
          status: 'success',
          message,
          meta: {
            requestId, // <- SIEMPRE string
            timestamp: new Date().toISOString(),
            apiVersion: this.apiVersion,
            durationMs,
          },
          data: payload ?? (null as unknown as T),
        };

        return responseBody;
      }),
    );
  }
}
