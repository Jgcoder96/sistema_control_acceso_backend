import { AppError } from '../../shared/errors/index.js';

export class LocationDoesNotExists extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'La ubicación no existe.') {
    super(message, true);
  }
}
