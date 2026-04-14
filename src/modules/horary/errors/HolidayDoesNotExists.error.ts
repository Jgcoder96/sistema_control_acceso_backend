import { AppError } from '../../shared/errors/index.js';

export class HolidayDoesNotExists extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'El día festivo no existe.') {
    super(message, true);
  }
}
