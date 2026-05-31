import { AppError } from '../../shared/errors/index.js';

export class UserAlreadyExist extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'Ya se encuentra registrado un usuario con la misma cédula o correo electrónico.',
  ) {
    super(message, true);
  }
}
