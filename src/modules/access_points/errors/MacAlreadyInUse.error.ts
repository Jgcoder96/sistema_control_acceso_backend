import { AppError } from '../../shared/errors/index.js';

export class MacAlreadyInUse extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'Ya se encuentra registrado un Punto de Acceso con esa dirección MAC.',
  ) {
    super(message, true);
  }
}
