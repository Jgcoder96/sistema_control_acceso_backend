import { AppError } from './App.error.js';

export class TokenExpired extends AppError {
  public readonly statusCode = 401;

  constructor(message = 'El token ha expirado.') {
    super(message, true);
  }
}
