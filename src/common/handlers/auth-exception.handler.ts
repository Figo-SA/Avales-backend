// src/common/handlers/auth-exception.handler.ts
import { BaseExceptionHandler, ProblemShape } from './base-exception.handler';
import { buildType } from '../herlpers/problem-details';
import { AuthException } from 'src/modules/auth/exceptions/auth.exceptions';

export class AuthExceptionHandler extends BaseExceptionHandler {
  canHandle(e: unknown): boolean {
    return e instanceof AuthException;
  }

  toProblem(e: AuthException, errorBase: string): ProblemShape {
    const errorResponse = e.getResponse() as any;
    const errorCode = errorResponse.errorCode || 'AUTH_ERROR';
    const field = errorResponse.field;

    return {
      status: e.getStatus(),
      title: this.getTitle(e.getStatus()),
      type: buildType(errorBase, this.getErrorType(errorCode)),
      detail: errorResponse.message || e.message,
      extensions: {
        errorCode,
        ...(field ? { field } : {}),
      },
    };
  }

  private getTitle(status: number): string {
    const titles: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      404: 'Not Found',
    };
    return titles[status] || 'Error';
  }

  private getErrorType(errorCode: string): string {
    const types: Record<string, string> = {
      INVALID_CREDENTIALS: 'invalid_credentials',
      INVALID_RESET_CODE: 'invalid_reset_code',
      INVALID_CURRENT_PASSWORD: 'invalid_current_password',
      EMAIL_SEND_FAILED: 'email_send_failed',
      USER_NOT_FOUND: 'user_not_found',
    };
    return types[errorCode] || 'auth_error';
  }
}
