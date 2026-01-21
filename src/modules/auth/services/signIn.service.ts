import { comparePasswords, generateJWT, getFileUrl } from '../helpers/index.js';
import { getUserByEmail } from '../models/index.js';
import { RecordNotFound, InvalidPassword } from '../../shared/errors/index.js';
import type { RequestBodySignIn } from '../types/index.js';

export const signInService = async (data: RequestBodySignIn) => {
  const user = await getUserByEmail(data.correo_electronico);

  if (!user) {
    throw new RecordNotFound('correo electronico', data.correo_electronico);
  }

  const isPasswordValid = await comparePasswords(data.clave, user.clave_hash);

  if (!isPasswordValid) {
    throw new InvalidPassword();
  }

  const token = await generateJWT(user.id);

  const profileImageUrl = await getFileUrl(user.foto_url!);

  return {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    correo_electronico: user.correo_electronico,
    token: token,
    foto_url: profileImageUrl,
  };
};
