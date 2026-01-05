import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción base para el módulo de usuarios
 */
export class UserException extends HttpException {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly field?: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    super({ message, errorCode, field }, statusCode);
  }
}

/**
 * Usuario no encontrado
 */
export class UserNotFoundException extends UserException {
  constructor() {
    super(
      'Usuario no encontrado',
      'USER_NOT_FOUND',
      undefined,
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Usuario ya fue eliminado (soft delete)
 */
export class UserAlreadyDeletedException extends UserException {
  constructor() {
    super(
      'Usuario ya fue eliminado',
      'USER_ALREADY_DELETED',
      undefined,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Usuario no está eliminado (para restore/hardDelete)
 */
export class UserNotDeletedException extends UserException {
  constructor() {
    super(
      'Usuario no está eliminado',
      'USER_NOT_DELETED',
      undefined,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Email ya existe
 */
export class EmailAlreadyExistsException extends UserException {
  constructor() {
    super(
      'El email ya existe en el sistema',
      'EMAIL_ALREADY_EXISTS',
      'email',
      HttpStatus.CONFLICT,
    );
  }
}

/**
 * Cédula ya existe
 */
export class CedulaAlreadyExistsException extends UserException {
  constructor() {
    super(
      'La cédula ya existe en el sistema',
      'CEDULA_ALREADY_EXISTS',
      'cedula',
      HttpStatus.CONFLICT,
    );
  }
}

/**
 * Rol no encontrado
 */
export class RoleNotFoundException extends UserException {
  constructor(roleName?: string) {
    super(
      roleName ? `Rol '${roleName}' no encontrado` : 'Rol no encontrado',
      'ROLE_NOT_FOUND',
      'roles',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

/**
 * Debe proporcionar al menos un rol
 */
export class NoRolesProvidedException extends UserException {
  constructor() {
    super(
      'Debe proporcionar al menos un rol',
      'NO_ROLES_PROVIDED',
      'roles',
      HttpStatus.BAD_REQUEST,
    );
  }
}
