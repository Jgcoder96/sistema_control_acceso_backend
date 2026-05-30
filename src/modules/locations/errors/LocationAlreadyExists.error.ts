import { AppError } from '../../shared/errors/index.js';

export class LocationAlreadyExists extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'Ya se encuentra registrado una ubicación con ese nombre o el mismo ID de malla.',
  ) {
    super(message, true);
  }
}
