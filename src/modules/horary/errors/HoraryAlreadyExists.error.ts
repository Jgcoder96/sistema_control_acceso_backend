import { AppError } from '../../shared/errors/index.js';

export class HoraryAlreadyExists extends AppError {
  public readonly statusCode = 409;

  constructor(message = 'El horario ya existe.') {
    super(message, true);
  }
}
