import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción base para errores del módulo de avales
 */
export class AvalException extends HttpException {
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
 * Aval no encontrado
 */
export class AvalNotFoundException extends AvalException {
  constructor() {
    super(
      'Aval no encontrado',
      'AVAL_NOT_FOUND',
      undefined,
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Evento no encontrado
 */
export class EventoNotFoundException extends AvalException {
  constructor() {
    super(
      'Evento no encontrado',
      'EVENTO_NOT_FOUND',
      'eventoId',
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Evento no disponible para solicitudes
 */
export class EventoNotAvailableException extends AvalException {
  constructor(estadoActual: string) {
    super(
      `El evento no está disponible para solicitudes. Estado actual: ${estadoActual}`,
      'EVENTO_NOT_AVAILABLE',
      'eventoId',
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * El evento ya tiene un aval creado
 */
export class AvalAlreadyExistsException extends AvalException {
  constructor() {
    super(
      'El evento ya tiene un aval creado',
      'AVAL_ALREADY_EXISTS',
      'eventoId',
      HttpStatus.CONFLICT,
    );
  }
}

/**
 * Estado inválido para la operación
 */
export class AvalInvalidStateException extends AvalException {
  constructor(operacion: string, estadoActual: string, estadosPermitidos: string[]) {
    super(
      `No se puede ${operacion} un aval en estado ${estadoActual}. Estados permitidos: ${estadosPermitidos.join(', ')}`,
      'AVAL_INVALID_STATE',
      'estado',
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Deportista no encontrado
 */
export class DeportistaNotFoundException extends AvalException {
  constructor(deportistaId: number) {
    super(
      `Deportista con ID ${deportistaId} no encontrado`,
      'DEPORTISTA_NOT_FOUND',
      'deportistaId',
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Usuario entrenador no encontrado
 */
export class EntrenadorNotFoundException extends AvalException {
  constructor(entrenadorId: number) {
    super(
      `Entrenador con ID ${entrenadorId} no encontrado`,
      'ENTRENADOR_NOT_FOUND',
      'entrenadorId',
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Rubro no encontrado
 */
export class RubroNotFoundException extends AvalException {
  constructor(rubroId: number) {
    super(
      `Rubro con ID ${rubroId} no encontrado`,
      'RUBRO_NOT_FOUND',
      'rubroId',
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Archivo no permitido
 */
export class AvalFileNotAllowedException extends AvalException {
  constructor() {
    super(
      'Solo se permiten archivos JPG, JPEG, PNG o PDF',
      'AVAL_FILE_NOT_ALLOWED',
      'archivo',
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Archivo muy grande
 */
export class AvalFileTooLargeException extends AvalException {
  constructor() {
    super(
      'El archivo no puede superar los 5MB',
      'AVAL_FILE_TOO_LARGE',
      'archivo',
      HttpStatus.BAD_REQUEST,
    );
  }
}
