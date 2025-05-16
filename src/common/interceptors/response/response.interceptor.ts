// response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { Request } from 'express';
import { ApiResponseDto } from '../../dtos/api-response.dto';
import { SUCCESS_MESSAGE_KEY } from 'src/common/decorators/success-messages.decorator';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

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
      map((data) => {
        if (
          data &&
          typeof data === 'object' &&
          'status' in data &&
          'message' in data &&
          'data' in data
        ) {
          return data as ApiResponseDto<T>;
        }

        const method = request.method.toUpperCase();
        const message =
          customMessage || defaultMessages[method] || 'Operación exitosa';

        return {
          status: 'success',
          message,
          data: data ?? null,
        };
      }),
    );
  }
}
