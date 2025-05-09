import { RoleHierarchy } from '../constants/role-hierarchy.constant';

export class RoleHelper {
  static hasRequiredRole(userRole: string, requiredRoles: string[]): boolean {
    const allowedRoles = RoleHierarchy[userRole] ?? [];
    return requiredRoles.some((role) => allowedRoles.includes(role));
  }
}
