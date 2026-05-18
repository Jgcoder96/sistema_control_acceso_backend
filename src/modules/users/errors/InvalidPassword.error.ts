import { AppError } from '../../shared/errors/index.js';

export class InvalidPassWord extends AppError {
  public readonly statusCode = 401;

  constructor(message = 'La contraseña proporcionada es incorrecta.') {
    super(message, true);
  }
}
