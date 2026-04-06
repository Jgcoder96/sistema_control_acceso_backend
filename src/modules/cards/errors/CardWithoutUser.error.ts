import { AppError } from '../../shared/errors/index.js';

export class CardWithoutUser extends AppError {
  public readonly statusCode = 400;

  constructor(message = 'La tarjeta no tiene un usuario asignado.') {
    super(message, true);
  }
}
