import { AppError } from '../../shared/errors/index.js';

export class InvalidStatusToReturnCard extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'El estado de la Tarjeta de Acceso no es válido para su devolución.',
  ) {
    super(message, true);
  }
}
