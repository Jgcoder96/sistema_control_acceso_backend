import { AppError } from '../../shared/errors/index.js';

export class UserDoesNotExists extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'El usuario no existe.') {
    super(message, true);
  }
}
