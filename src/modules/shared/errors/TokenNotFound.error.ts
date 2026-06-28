import { AppError } from './App.error.js';

export class TokenNotFound extends AppError {
  public readonly statusCode = 401;

  constructor(message = 'Token no proporcionado.') {
    super(message, true);
  }
}
