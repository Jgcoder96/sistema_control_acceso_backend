import { AppError } from '../../shared/errors/index.js';

export class ExistingPermit extends AppError {
  public readonly statusCode = 400;

  constructor(
    message = 'Ya existe un permiso asociado a este usuario en este control de acceso.',
  ) {
    super(message, true);
  }
}
