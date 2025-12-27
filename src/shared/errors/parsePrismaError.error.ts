export const parsePrismaError = (error: string) => {
  switch (error) {
    case 'P2002':
      return {
        statusCode: 409,
        message: 'El registro ya existe',
      };
    default:
      return {
        statusCode: 500,
        message: `Error en la base de datos`,
      };
  }
};
