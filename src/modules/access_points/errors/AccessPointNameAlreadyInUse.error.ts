import { AppError } from '../../shared/errors/index.js';

export class AccessPointNameAlreadyInUse extends AppError {
  public readonly statusCode = 409;

  constructor(message = 'El nombre del punto de acceso ya está en uso.') {
    super(message, true);
  }
}
