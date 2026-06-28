import { AppError } from './App.error.js';

export class UnauthenticatedUser extends AppError {
  public readonly statusCode = 401;

  constructor(message = 'Usuario no autenticado.') {
    super(message, true);
  }
}
