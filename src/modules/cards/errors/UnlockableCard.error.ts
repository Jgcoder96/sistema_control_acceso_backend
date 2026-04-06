import { AppError } from '../../shared/errors/index.js';

export class UnlockableCard extends AppError {
  public readonly statusCode = 400;

  constructor(message = 'La tarjeta no es desbloqueable.') {
    super(message, true);
  }
}
