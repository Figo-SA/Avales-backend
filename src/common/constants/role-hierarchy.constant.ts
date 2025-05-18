export const RoleHierarchy: Record<string, string[]> = {
  'super-admin': ['super-admin', 'admin', 'secretaria', 'entrenador', 'dtm'],
  admin: ['admin', 'secretaria', 'dtm', 'entrenador'],
  dtm: ['dtm'],
  secretaria: ['secretaria'],
  entrenador: ['entrenador'],
};
