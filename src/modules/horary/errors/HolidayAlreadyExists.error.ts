import { AppError } from '../../shared/errors/index.js';

export class HolidayAlreadyExists extends AppError {
  public readonly statusCode = 409;

  constructor(message = 'El día festivo ya existe.') {
    super(message, true);
  }
}
