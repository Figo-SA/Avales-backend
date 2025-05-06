import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleHelper } from 'src/common/herlpers/role.helper';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('User:', user);
    console.log('Required Roles:', requiredRoles);

    const hasAccess = RoleHelper.hasRequiredRole(user.rol, requiredRoles);
    if (!hasAccess) {
      throw new ForbiddenException(
        `No tienes permisos suficientes para acceder a este recurso. Se requieren los siguientes roles: [${requiredRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
