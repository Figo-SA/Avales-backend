import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción base para errores de autenticación con códigos específicos
 */
export class AuthException extends HttpException {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly field?: string,
    statusCode: number = HttpStatus.UNAUTHORIZED,
  ) {
    super(
      {
        message,
        errorCode,
        field,
      },
      statusCode,
    );
  }
}

/**
 * Credenciales inválidas (email o contraseña incorrectos)
 */
export class InvalidCredentialsException extends AuthException {
  constructor() {
    super(
      'Email o contraseña incorrectos',
      'INVALID_CREDENTIALS',
      undefined,
      HttpStatus.UNAUTHORIZED,
    );
  }
}

/**
 * Código de reset inválido o expirado
 */
export class InvalidResetCodeException extends AuthException {
  constructor() {
    super(
      'Código inválido o expirado. Por favor solicita un nuevo código',
      'INVALID_RESET_CODE',
      'code',
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Contraseña actual incorrecta
 */
export class InvalidCurrentPasswordException extends AuthException {
  constructor() {
    super(
      'La contraseña actual es incorrecta',
      'INVALID_CURRENT_PASSWORD',
      'currentPassword',
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Error al enviar email
 */
export class EmailSendFailedException extends AuthException {
  constructor() {
    super(
      'Error al enviar el correo de recuperación',
      'EMAIL_SEND_FAILED',
      undefined,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Usuario no encontrado
 */
export class UserNotFoundException extends AuthException {
  constructor() {
    super(
      'Usuario no encontrado',
      'USER_NOT_FOUND',
      undefined,
      HttpStatus.NOT_FOUND,
    );
  }
}
