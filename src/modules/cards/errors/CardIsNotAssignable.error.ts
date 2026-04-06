import { AppError } from '../../shared/errors/index.js';

export class CardIsNotAssignable extends AppError {
  public readonly statusCode = 400;

  constructor(message = 'No se puede asignar una tarjeta que no está activa.') {
    super(message, true);
  }
}
