import { AppError } from '../../shared/errors/index.js';

export class InvalidHorary extends AppError {
  public readonly statusCode = 400;

  constructor(message = 'El horario es inválido.') {
    super(message, true);
  }
}
