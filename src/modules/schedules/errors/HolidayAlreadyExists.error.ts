import { AppError } from '../../shared/errors/index.js';

export class HolidayAlreadyExists extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'Ya se encuentra registrado un feriado con esa fecha.',
  ) {
    super(message, true);
  }
}
