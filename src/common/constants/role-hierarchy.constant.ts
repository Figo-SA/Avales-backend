export const RoleHierarchy: Record<string, string[]> = {
  'super-admin': ['super-admin', 'admin', 'secretaria', 'entrenador'],
  admin: ['admin', 'secretaria'],
  secretaria: ['secretaria'],
  entrenador: ['entrenador'],
};
