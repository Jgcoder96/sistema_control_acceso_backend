export class RecordNotFound extends Error {
  constructor(
    public readonly fieldName: string,
    public readonly value: string,
    public readonly statusCode: number = 404,
  ) {
    let message: string;
    if (fieldName === 'user_id') {
      message = `No se encontró ningún usuario con ID '${value}'`;
    } else if (fieldName === 'user_email') {
      message = `No se encontró ningún usuario con email '${value}'`;
    } else {
      message = `No se encontró ninguna tarjeta con el ID '${value}'`;
    }
    super(message);

    this.name = 'RecordNotFound';

    this.stack = '';
  }
}
