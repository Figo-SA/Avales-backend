import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 10;

  /**
   * Hashea una contraseña usando bcrypt.
   * @param password Contraseña en texto plano.
   * @returns Contraseña hasheada.
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compara una contraseña en texto plano con una contraseña hasheada.
   * @param password Contraseña en texto plano.
   * @param hashedPassword Contraseña hasheada.
   * @returns Verdadero si coinciden, falso si no.
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
