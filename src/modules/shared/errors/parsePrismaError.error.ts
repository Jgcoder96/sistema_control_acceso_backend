export const parsePrismaError = (error: string) => {
  switch (error) {
    case 'P2002':
      return {
        statusCode: 409,
        message: 'Ya existe una cuenta vinculada a estos datos',
      };
    default:
      return {
        statusCode: 500,
        message: `Error interno del servidor.`,
      };
  }
};
