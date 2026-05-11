import { AppError } from '../../shared/errors/index.js';

export class PermissionsDoesNotExist extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'Los permisos no se encuentran registrados.') {
    super(message, true);
  }
}
