import { AppError } from './App.error.js';

export class InsufficientPermissions extends AppError {
  public readonly statusCode = 403;

  constructor(message = 'No tienes los permisos necesarios.') {
    super(message, true);
  }
}
