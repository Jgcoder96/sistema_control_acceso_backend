import { AppError } from './App.error.js';

export class TokenInvalid extends AppError {
  public readonly statusCode = 401;

  constructor(message = 'Token inválido.') {
    super(message, true);
  }
}
