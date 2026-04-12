import { AppError } from '../../shared/errors/index.js';

export class AccessPointAlreadyExists extends AppError {
  public readonly statusCode = 409;

  constructor(message = 'El punto de acceso ya existe.') {
    super(message, true);
  }
}
