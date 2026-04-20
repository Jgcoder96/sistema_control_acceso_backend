import { AppError } from '../../shared/errors/index.js';

export class PhysicalPermitDoesNotExists extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'El permiso no existe.') {
    super(message, true);
  }
}
