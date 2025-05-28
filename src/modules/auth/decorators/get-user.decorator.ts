import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

import { UsuarioConRoles } from '../interfaces/usuario-roles';

interface RequestWithUser extends Request {
  user?: UsuarioConRoles;
}

export const GetUser = createParamDecorator(
  (data: keyof UsuarioConRoles | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user as UsuarioConRoles;

    if (!user) {
      throw new InternalServerErrorException('User not found in request');
    }

    return data ? user[data] : user;
  },
);
