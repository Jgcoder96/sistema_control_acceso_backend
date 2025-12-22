import { createUser } from '../models/createUser.model.js';
import type { UserToCreate } from '../types/UserToCreate.type.js';

export const signUpService = async (userData: UserToCreate) => {
  // Aquí iría lógica de negocio (ej. encriptar password, verificar si el email existe)
  const newUser = await createUser(userData);

  // Retornamos solo los datos necesarios
  return {
    id: newUser.id,
    nombre: newUser.nombre,
  };
};
