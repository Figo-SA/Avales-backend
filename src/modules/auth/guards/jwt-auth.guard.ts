// src/modules/auth/guards/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Si el token NO está en Authorization, lo buscamos en la cookie:
    if (
      !request.headers['authorization'] &&
      request.cookies &&
      request.cookies.auth_token
    ) {
      request.headers['authorization'] = `Bearer ${request.cookies.auth_token}`;
    }

    return request;
  }
}
