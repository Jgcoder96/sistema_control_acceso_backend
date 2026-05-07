import { AppError } from '../../shared/errors/index.js';

export class AppPermissionDoesNotExist extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'El Permiso no se encuentra registrado.') {
    super(message, true);
  }
}
