import { AppError } from '../../shared/errors/index.js';

export class InvalidToken extends AppError {
  public readonly statusCode = 401;

  constructor(message = 'Token de autenticación inválido.') {
    super(message, true);
  }
}
