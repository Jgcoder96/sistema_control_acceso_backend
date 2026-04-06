export abstract class AppError extends Error {
  public abstract readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, isOperational = true) {
    super(message);
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
