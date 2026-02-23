export class publishDataError extends Error {
  constructor(
    public readonly message: string = 'No se pudo establecer comunicación con el broker de mensajería',
    public readonly statusCode: number = 502,
  ) {
    super(message);

    this.name = 'publishDataError';

    this.stack = '';
  }
}
