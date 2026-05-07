import { AppError } from '../../shared/errors/index.js';

export class AppPermissionSlugAlreadyExist extends AppError {
  public readonly statusCode = 409;

  constructor(
    message = 'Ya se encuentra registrado un permiso activo con este slug.',
  ) {
    super(message, true);
  }
}
