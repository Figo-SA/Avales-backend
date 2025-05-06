import { RoleHierarchy } from '../constants/role-hierarchy.constant';

export class RoleHelper {
  static hasRequiredRole(userRole: string, requiredRoles: string[]): boolean {
    const allowedRoles = RoleHierarchy[userRole] ?? [];
    console.log('Allowed Roles:', allowedRoles);
    return requiredRoles.some((role) => allowedRoles.includes(role));
  }
}
