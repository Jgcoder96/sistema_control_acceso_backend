import { AppError } from '../../shared/errors/index.js';

export class AccessPointDoesNotExists extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'El punto de acceso no existe.') {
    super(message, true);
  }
}
