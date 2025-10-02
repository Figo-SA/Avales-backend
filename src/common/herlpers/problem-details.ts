// src/common/helpers/problem-details.ts
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  // extensiones que tú añades:
  requestId: string;
  apiVersion: string;
  durationMs?: number;
  // cualquier otra extensión
  [key: string]: unknown;
}

export function normalizeRequestId(
  val: string | string[] | undefined,
  fallback: string,
): string {
  if (Array.isArray(val)) return val[0] ?? fallback;
  return val ?? fallback;
}

export function buildType(base: string, slug: string) {
  return `${base.replace(/\/$/, '')}/${slug}`;
}

export const HttpStatusTitle: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
};
