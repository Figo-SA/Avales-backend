// src/common/filters/handlers/http-error.handler.ts
import { HttpException } from '@nestjs/common';
import { BaseExceptionHandler, ProblemShape } from './base-exception.handler';
import { buildType, HttpStatusTitle } from '../herlpers/problem-details';

export class HttpErrorHandler extends BaseExceptionHandler {
  canHandle(e: unknown): boolean {
    return e instanceof HttpException;
  }

  toProblem(e: HttpException, errorBase: string): ProblemShape {
    const status = e.getStatus();
    const resp = e.getResponse();
    let detail: string | undefined;
    let title = HttpStatusTitle[status] ?? 'Error';
    let type = buildType(
      errorBase,
      (HttpStatusTitle[status] ?? 'error').toLowerCase().replace(/\s+/g, '_'),
    );
    const extensions: Record<string, any> = {};

    if (typeof resp === 'string') {
      detail = resp;
    } else {
      const r = resp as any;
      const msg = Array.isArray(r.message) ? r.message.join('; ') : r.message;
      detail = msg || e.message;

      if (Array.isArray(r.message)) {
        extensions.errors = r.message.map((m: any) =>
          typeof m === 'string' ? { message: m } : m,
        );
      }
      if (r.error) {
        title = r.error;
        type = buildType(
          errorBase,
          String(r.error).toLowerCase().replace(/\s+/g, '_'),
        );
      }
    }

    return { status, title, type, detail: detail ?? title, extensions };
  }
}
