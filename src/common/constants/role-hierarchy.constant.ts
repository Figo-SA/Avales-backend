export const RoleHierarchy: Record<string, string[]> = {
  'super-admin': ['super-admin', 'admin', 'secretaria'],
  admin: ['admin', 'secretaria'],
  secretaria: ['secretaria'],
};
