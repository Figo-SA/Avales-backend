import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { Observable } from 'rxjs';
import { Usuario } from '@prisma/client';

type UsuarioConRoles = Usuario & {
  usuariosRol: {
    rol: {
      nombre: string;
    };
  }[];
};

interface RequestWithUser extends Request {
  user?: UsuarioConRoles;
}

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles || validRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user as UsuarioConRoles;

    if (!user) throw new BadRequestException('User not found in request');
    console.log(user);

    for (const role of user.usuariosRol) {
      if (validRoles.includes(role.rol.nombre)) {
        return true;
      }
    }
    console.log(user.usuariosRol);

    throw new ForbiddenException(
      `User ${user.email} does not have access, needs one of: ${validRoles.join(', ')}`,
    );
  }
}
