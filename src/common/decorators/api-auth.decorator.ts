import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Auth } from '../../modules/auth/decorators';
import { ValidRoles } from '../../modules/auth/interfaces/valid-roles';

/**
 * Decorador compuesto para autenticación y autorización
 * Combina @Auth, @ApiBearerAuth y las respuestas de error estándar
 *
 * @param roles - Roles permitidos para acceder al endpoint
 *
 * @example
 * ```typescript
 * @Get('admin-only')
 * @ApiAuth(ValidRoles.admin)
 * getAdminData() {
 *   return this.service.getAdminData();
 * }
 * ```
 */
export function ApiAuth(...roles: ValidRoles[]) {
  return applyDecorators(
    Auth(...roles),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token inválido o faltante',
      content: {
        'application/problem+json': {
          schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                example: 'https://api.tu-dominio.com/errors/unauthorized',
              },
              title: { type: 'string', example: 'Unauthorized' },
              status: { type: 'number', example: 401 },
              detail: {
                type: 'string',
                example: 'Token inválido o faltante',
              },
              instance: { type: 'string', example: '/api/v1/users' },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00Z',
              },
              requestId: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000',
              },
              apiVersion: { type: 'string', example: 'v1' },
            },
          },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Permisos insuficientes para esta operación',
      content: {
        'application/problem+json': {
          schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                example: 'https://api.tu-dominio.com/errors/forbidden',
              },
              title: { type: 'string', example: 'Forbidden' },
              status: { type: 'number', example: 403 },
              detail: {
                type: 'string',
                example:
                  'No tienes permisos suficientes para realizar esta acción',
              },
              instance: { type: 'string', example: '/api/v1/users' },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00Z',
              },
              requestId: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000',
              },
              apiVersion: { type: 'string', example: 'v1' },
            },
          },
        },
      },
    }),
  );
}
