import { AppError } from '../../shared/errors/index.js';

export class LocationAlreadyExists extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'Este nombre ya está asignado a otra ubicación física.',
  ) {
    super(message, true);
  }
}
