import { comparePasswords, generateJWT, getFileUrl } from '../helpers/index.js';
import { getUserByEmail } from '../models/index.js';
import { UserEmailDoesNotExist, InvalidPassWord } from '../errors/index.js';
import type { LoginInRequestBody } from '../types/index.js';

export const loginService = async ({
  correo_electronico,
  clave,
}: LoginInRequestBody) => {
  const user = await getUserByEmail(correo_electronico);

  if (!user) throw new UserEmailDoesNotExist();

  const isPasswordValid = await comparePasswords(clave, user.clave_hash);

  if (!isPasswordValid) throw new InvalidPassWord();

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
