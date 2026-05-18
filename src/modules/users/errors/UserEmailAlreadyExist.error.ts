import { AppError } from '../../shared/errors/index.js';

export class UserEmailAlreadyExist extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'Ya se encuentra registrado un usuario con el correo electrónico.',
  ) {
    super(message, true);
  }
}
