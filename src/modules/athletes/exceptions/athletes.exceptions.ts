import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Excepción base para errores del módulo de atletas
 */
export class AthleteException extends HttpException {
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
 * Atleta no encontrado
 */
export class AthleteNotFoundException extends AthleteException {
  constructor() {
    super(
      'Atleta no encontrado',
      'ATHLETE_NOT_FOUND',
      undefined,
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Atleta ya eliminado (soft delete)
 */
export class AthleteAlreadyDeletedException extends AthleteException {
  constructor() {
    super(
      'Atleta ya fue eliminado',
      'ATHLETE_ALREADY_DELETED',
      undefined,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Atleta no está eliminado (para restore)
 */
export class AthleteNotDeletedException extends AthleteException {
  constructor() {
    super(
      'Atleta no está eliminado',
      'ATHLETE_NOT_DELETED',
      undefined,
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Cédula duplicada
 */
export class AthleteCedulaDuplicateException extends AthleteException {
  constructor() {
    super(
      'Ya existe un atleta con esa cédula',
      'ATHLETE_CEDULA_DUPLICATE',
      'cedula',
      HttpStatus.CONFLICT,
    );
  }
}

/**
 * Categoría no encontrada
 */
export class CategoryNotFoundException extends AthleteException {
  constructor() {
    super(
      'Categoría no encontrada',
      'CATEGORY_NOT_FOUND',
      'categoryId',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

/**
 * Disciplina no encontrada
 */
export class DisciplineNotFoundException extends AthleteException {
  constructor() {
    super(
      'Disciplina no encontrada',
      'DISCIPLINE_NOT_FOUND',
      'disciplineId',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
