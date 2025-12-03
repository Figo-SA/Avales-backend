import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  constructor(private readonly targetClass: any) {}

  async transform(value: string) {
    if (!value) {
      throw new BadRequestException('El campo solicitudData es requerido');
    }

    let parsedValue: any;
    try {
      parsedValue = JSON.parse(value);
    } catch (error) {
      throw new BadRequestException(
        'El formato del JSON en solicitudData es inválido',
      );
    }

    // Transformar a la clase DTO
    const object = plainToInstance(this.targetClass, parsedValue);

    // Validar
    const errors = await validate(object);
    if (errors.length > 0) {
      const messages = errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      }));
      throw new BadRequestException({
        message: 'Errores de validación en solicitudData',
        errors: messages,
      });
    }

    return object;
  }
}
