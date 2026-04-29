import { AppError } from '../../shared/errors/index.js';

export class MacAlreadyInUse extends AppError {
  public readonly statusCode = 409;

  constructor(message = 'La dirección MAC ya está en uso.') {
    super(message, true);
  }
}
