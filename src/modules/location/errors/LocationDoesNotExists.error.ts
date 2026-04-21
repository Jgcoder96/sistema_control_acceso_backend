import { AppError } from '../../shared/errors/index.js';

export class LocationDoesNotExists extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'La ubicación física no existe.') {
    super(message, true);
  }
}
