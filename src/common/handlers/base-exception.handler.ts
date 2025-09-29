// src/common/filters/handlers/base-exception.handler.ts
export interface ProblemShape {
  status: number;
  title: string;
  type: string;
  detail: string;
  extensions?: Record<string, any>;
}

export abstract class BaseExceptionHandler {
  abstract canHandle(e: unknown): boolean;
  abstract toProblem(e: unknown, errorBase: string): ProblemShape;
}
