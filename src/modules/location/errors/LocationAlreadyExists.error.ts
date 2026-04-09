import { AppError } from '../../shared/errors/index.js';

export class LocationAlreadyExists extends AppError {
  public readonly statusCode = 409;

  constructor(message = 'La ubicación ya existe.') {
    super(message, true);
  }
}
