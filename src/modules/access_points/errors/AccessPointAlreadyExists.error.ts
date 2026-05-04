import { AppError } from '../../shared/errors/index.js';

export class AccessPointAlreadyExists extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'Ya se encuentra registrado un Punto de Acceso con ese nombre.',
  ) {
    super(message, true);
  }
}
