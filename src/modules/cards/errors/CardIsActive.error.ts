import { AppError } from '../../shared/errors/index.js';

export class CardIsActive extends AppError {
  public readonly statusCode = 409;

  constructor(message = 'No se puede eliminar una tarjeta activa.') {
    super(message, true);
  }
}
