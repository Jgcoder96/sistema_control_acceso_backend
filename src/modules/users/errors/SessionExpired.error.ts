import { AppError } from '../../shared/errors/index.js';

export class SessionExpired extends AppError {
  public readonly statusCode = 401;

  constructor(
    message = 'Su sesión ha expirado por tiempo. Inicie sesión de nuevo.',
  ) {
    super(message, true);
  }
}
