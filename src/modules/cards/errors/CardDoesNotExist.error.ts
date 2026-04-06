import { AppError } from '../../shared/errors/index.js';

export class CardDoesNotExist extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'La tarjeta no existe.') {
    super(message, true);
  }
}
