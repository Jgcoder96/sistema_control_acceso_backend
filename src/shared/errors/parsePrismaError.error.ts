export const parsePrismaError = (error: string) => {
  switch (error) {
    case 'P2002':
      return {
        statusCode: 409,
        message: 'Ya existe un registro con esos datos únicos.',
      };
    default:
      return {
        statusCode: 500,
        message: `Error inesperado de la base de datos`,
      };
  }
};
