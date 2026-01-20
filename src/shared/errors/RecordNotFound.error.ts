export class RecordNotFound extends Error {
  constructor(
    public readonly fieldName: string,
    public readonly value: string,
    public readonly statusCode: number = 404,
  ) {
    const message = `No se encontró ningún usuario con el ${fieldName} '${value}'.`;

    super(message);

    this.name = 'RecordNotFound';

    this.stack = '';
  }
}
