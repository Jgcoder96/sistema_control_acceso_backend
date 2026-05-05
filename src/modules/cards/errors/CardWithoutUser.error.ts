import { AppError } from '../../shared/errors/index.js';

export class CardWithoutUser extends AppError {
  public readonly statusCode = 409;

  constructor(message = 'La Tarjeta de Acceso no tiene un usuario asignado.') {
    super(message, true);
  }
}
