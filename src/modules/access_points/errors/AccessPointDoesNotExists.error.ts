import { AppError } from '../../shared/errors/index.js';

export class AccessPointDoesNotExists extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'El Punto de Acceso no existe.') {
    super(message, true);
  }
}
