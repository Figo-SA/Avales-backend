import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T>>
{
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

    return next.handle().pipe(
      map((data) => {
        // Si el controlador ya devuelve un objeto con status/message/data, no lo reenvuelvas
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
        const message = defaultMessages[method] || 'Operación exitosa';

        return {
          status: 'success',
          message,
          data: data ?? null,
        };
      }),
    );
  }
}
