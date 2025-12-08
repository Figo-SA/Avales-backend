// src/modules/auth/decorators/auth.decorator.ts
import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interfaces/valid-roles';
import { META_ROLES } from './role-protected.decorator';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    // 1. Guard JWT → llena request.user a partir del token (cookie o header)
    UseGuards(JwtAuthGuard, UserRoleGuard),
    // 2. Metadatos de roles para UserRoleGuard
    SetMetadata(META_ROLES, roles),
  );
}
