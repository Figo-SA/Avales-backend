export function trimString(value: unknown): string | undefined {
  if (typeof value === 'string') return value.trim();
  return undefined;
}

export function trimAndLowercase(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }
  return undefined;
}
