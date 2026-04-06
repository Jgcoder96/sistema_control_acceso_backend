import { AppError } from '../../shared/errors/index.js';

export class CardIsAlreadyDeleted extends AppError {
  public readonly statusCode = 400;

  constructor(
    message = 'No se puede eliminar la tarjeta. La tarjeta ya está eliminada.',
  ) {
    super(message, true);
  }
}
