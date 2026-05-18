import { AppError } from '../../shared/errors/index.js';

export class UserIDAlreadyExist extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'Ya se encuentra registrado un usuario con esa cédula.',
  ) {
    super(message, true);
  }
}
