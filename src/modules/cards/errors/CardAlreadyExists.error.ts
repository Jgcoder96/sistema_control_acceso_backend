import { AppError } from '../../shared/errors/index.js';

export class CardAlreadyExists extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'Ya se encuentra registrada una Tarjeta de Acceso con ese código.',
  ) {
    super(message, true);
  }
}
