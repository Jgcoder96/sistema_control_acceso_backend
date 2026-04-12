import { AppError } from '../../shared/errors/index.js';

export class MacIsAlreadyAssigned extends AppError {
  public readonly statusCode = 409;

  constructor(message = 'Esta MAC ya está asignada a un punto activo.') {
    super(message, true);
  }
}
