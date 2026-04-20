import { AppError } from '../../shared/errors/index.js';

export class HoraryDoesNotExists extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'El horario no existe.') {
    super(message, true);
  }
}
