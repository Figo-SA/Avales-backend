import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SuccessMessage } from 'src/common/decorators/success-messages.decorator';
import {
  ApiCreatedResponseData,
  ApiOkResponseData,
} from 'src/common/swagger/decorators/api-success-responses.decorator';
import { ApiErrorResponsesConfig } from 'src/common/swagger/decorators/api-error-responses.decorator';
import { LoginResponseDto } from '../dto/login-response.dto';

/**
 * Decorador para el endpoint de login
 */
export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Inicia sesión y obtiene un token JWT' }),
    SuccessMessage('Login exitoso'),
    ApiOkResponseData(LoginResponseDto, undefined, 'Login exitoso', true),
    ApiErrorResponsesConfig([400, 401, 422, 500], {
      401: {
        type: 'https://api.tu-dominio.com/errors/unauthorized',
        title: 'Unauthorized',
        status: 401,
        detail: 'Email o contraseña incorrectos',
        instance: '/api/v1/auth/login',
        apiVersion: 'v1',
      },
      422: {
        type: 'https://api.tu-dominio.com/errors/unprocessable-entity',
        title: 'Unprocessable Entity',
        status: 422,
        detail: 'Cuenta bloqueada por intentos fallidos',
        instance: '/api/v1/auth/login',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de check-status
 */
export function ApiCheckStatus() {
  return applyDecorators(
    ApiOperation({ summary: 'Verifica el estado de autenticación actual' }),
    SuccessMessage('Estado de autenticación verificado'),
    ApiOkResponseData(
      LoginResponseDto,
      undefined,
      'Estado válido; devuelve el usuario o datos de sesión',
      true,
    ),
    ApiErrorResponsesConfig([401, 500], {
      401: {
        type: 'https://api.tu-dominio.com/errors/unauthorized',
        title: 'Unauthorized',
        status: 401,
        detail: 'Token inválido o expirado',
        instance: '/api/v1/auth/check-status',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para el endpoint de profile
 */
export function ApiGetProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene el perfil del usuario autenticado',
      description: `
Retorna los datos del usuario actualmente autenticado, incluyendo sus roles asignados.

**Requiere autenticación:** Bearer token JWT válido.
      `.trim(),
    }),
    SuccessMessage('Perfil obtenido correctamente'),
    ApiOkResponseData(
      LoginResponseDto,
      undefined,
      'Perfil del usuario autenticado',
      true,
    ),
    ApiErrorResponsesConfig([401, 500], {
      401: {
        type: 'https://api.tu-dominio.com/errors/unauthorized',
        title: 'Unauthorized',
        status: 401,
        detail: 'Token inválido o expirado',
        instance: '/api/v1/auth/profile',
        apiVersion: 'v1',
      },
    }),
  );
}
