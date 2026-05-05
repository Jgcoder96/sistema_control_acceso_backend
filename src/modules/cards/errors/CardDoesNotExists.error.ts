import { AppError } from '../../shared/errors/index.js';

export class CardDoesNotExists extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'La Tarjeta de Acceso no se encuentra registrada.') {
    super(message, true);
  }
}
