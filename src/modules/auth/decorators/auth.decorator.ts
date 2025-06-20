import { applyDecorators, UseGuards } from '@nestjs/common';

import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interfaces/valid-roles';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    ApiBearerAuth('JWT'),
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
