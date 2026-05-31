import { AppError } from '../../shared/errors/index.js';

export class ScheduleInUse extends AppError {
  public readonly statusCode = 400;

  constructor(
    message = 'No se puede eliminar el horario porque está asignado a permisos de acceso activos.',
  ) {
    super(message, true);
  }
}
