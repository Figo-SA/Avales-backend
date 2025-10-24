import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiBody } from '@nestjs/swagger';
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

/**
 * Decorador para solicitar código de recuperación (forgot-password)
 */
export function ApiForgotPassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Solicitar código de recuperación',
      description:
        'Envía un código de 6 dígitos al email del usuario para recuperar su contraseña',
    }),
    SuccessMessage('Código de recuperación enviado si el email existe'),
    ApiBody({ type: require('../dto/forgot-password.dto').ForgotPasswordDto }),
    ApiOkResponse({
      description:
        'Si el email existe en nuestro sistema, recibirás un código de verificación en el correo',
    }),
    ApiErrorResponsesConfig([400, 500], {
      500: {
        type: 'https://api.tu-dominio.com/errors/email_send_failed',
        title: 'Email Send Failed',
        status: 500,
        detail: 'Error al enviar el correo de recuperación',
        instance: '/api/v1/auth/forgot-password',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para restablecer contraseña con código (reset-password)
 */
export function ApiResetPassword() {
  return applyDecorators(
    ApiOperation({
      summary: 'Restablecer contraseña con código',
      description:
        'Restablece la contraseña usando el código de 6 dígitos recibido por email',
    }),
    SuccessMessage('Contraseña restablecida correctamente'),
    ApiBody({ type: require('../dto/reset-password.dto').ResetPasswordDto }),
    ApiOkResponse({ description: 'Contraseña actualizada exitosamente' }),
    ApiErrorResponsesConfig([400, 422, 500], {
      400: {
        type: 'https://api.tu-dominio.com/errors/invalid_reset_code',
        title: 'Bad Request',
        status: 400,
        detail:
          'Código inválido o expirado. Por favor solicita un nuevo código',
        instance: '/api/v1/auth/reset-password',
        apiVersion: 'v1',
      },
    }),
  );
}

/**
 * Decorador para cambiar contraseña (change-password)
 */
export function ApiChangePassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Cambiar contraseña' }),
    SuccessMessage('Contraseña cambiada exitosamente'),
    ApiBody({ type: require('../dto/change-password.dto').ChangePasswordDto }),
    ApiOkResponse({ description: 'Contraseña cambiada exitosamente' }),
    ApiErrorResponsesConfig([400, 401, 404, 500], {
      400: {
        type: 'https://api.tu-dominio.com/errors/invalid_current_password',
        title: 'Bad Request',
        status: 400,
        detail: 'La contraseña actual es incorrecta',
        instance: '/api/v1/auth/change-password',
        apiVersion: 'v1',
      },
    }),
  );
}
