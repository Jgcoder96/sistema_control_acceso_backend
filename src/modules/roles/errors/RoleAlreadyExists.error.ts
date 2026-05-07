import { AppError } from '../../shared/errors/index.js';

export class RoleAlreadyExists extends AppError {
  public readonly statusCode = 409;

  constructor(message = 'Ya se encuentra registrado un rol con ese nombre.') {
    super(message, true);
  }
}
