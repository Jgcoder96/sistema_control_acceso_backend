import { AppError } from '../../shared/errors/index.js';

export class UserEmailDoesNotExist extends AppError {
  public readonly statusCode = 404;

  constructor(
    message = 'No se encontró ningún usuario con el correo electrónico proporcionado.',
  ) {
    super(message, true);
  }
}
