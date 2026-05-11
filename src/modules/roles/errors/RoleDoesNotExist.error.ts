import { AppError } from '../../shared/errors/index.js';

export class RoleDoesNotExist extends AppError {
  public readonly statusCode = 404;

  constructor(message = 'El Rol no se encuentra registrado.') {
    super(message, true);
  }
}
