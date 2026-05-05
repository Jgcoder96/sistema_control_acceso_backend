import { AppError } from '../../shared/errors/index.js';

export class CardIsNotActive extends AppError {
  public readonly statusCode = 409;

  constructor(message = 'No se puede bloquear la tarjeta si no está activa.') {
    super(message, true);
  }
}
