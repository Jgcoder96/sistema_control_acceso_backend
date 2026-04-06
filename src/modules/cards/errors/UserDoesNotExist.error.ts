import { AppError } from '../../shared/errors/index.js';

export class UserDoesNotExist extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'El usuario no existe.') {
    super(message, true);
  }
}
