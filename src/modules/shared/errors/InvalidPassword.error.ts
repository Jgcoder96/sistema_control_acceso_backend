export class InvalidPassword extends Error {
  constructor(
    public readonly message: string = 'La contraseña proporcionada es incorrecta',
    public readonly statusCode: number = 401,
  ) {
    super(message);

    this.name = 'InvalidPassword';

    this.stack = '';
  }
}
