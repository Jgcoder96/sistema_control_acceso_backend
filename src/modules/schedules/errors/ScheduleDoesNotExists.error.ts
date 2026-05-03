import { AppError } from '../../shared/errors/index.js';

export class ScheduleDoesNotExists extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'El horario no se encuentra registrado.') {
    super(message, true);
  }
}
