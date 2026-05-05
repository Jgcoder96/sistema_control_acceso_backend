import { AppError } from '../../shared/errors/index.js';

export class CardIsAlreadyDeleted extends AppError {
  public readonly statusCode = 409;

  constructor(message = 'La Tarjeta de Acceso ya se encuentra eliminada.') {
    super(message, true);
  }
}
