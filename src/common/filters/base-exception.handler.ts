// base-exception.handler.ts
import { ArgumentsHost } from '@nestjs/common';

export interface BaseExceptionHandler {
  canHandle(exception: unknown): boolean;
  handle(exception: unknown, host: ArgumentsHost): void;
}
