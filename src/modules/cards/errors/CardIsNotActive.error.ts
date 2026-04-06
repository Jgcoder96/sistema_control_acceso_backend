import { AppError } from '../../shared/errors/index.js';

export class CardIsNotActive extends AppError {
  public readonly statusCode = 400;

  constructor(
    message = 'No se puede bloquear la tarjeta. La tarjeta no está activa.',
  ) {
    super(message, true);
  }
}
