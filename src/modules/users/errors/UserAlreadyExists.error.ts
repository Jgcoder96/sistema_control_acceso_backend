import { AppError } from '../../shared/errors/index.js';

export class UserAlreadyExist extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'Ya se encuentra registrado un usuario con esos datos.',
  ) {
    super(message, true);
  }
}
