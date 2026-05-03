import { AppError } from '../../shared/errors/index.js';

export class ScheduleAlreadyExists extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'Ya se encuentra registrado un horario con ese nombre.',
  ) {
    super(message, true);
  }
}
