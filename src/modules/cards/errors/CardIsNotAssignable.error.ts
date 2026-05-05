import { AppError } from '../../shared/errors/index.js';

export class CardIsNotAssignable extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'No se puede asignar una Tarjeta de Acceso que no está activa.',
  ) {
    super(message, true);
  }
}
