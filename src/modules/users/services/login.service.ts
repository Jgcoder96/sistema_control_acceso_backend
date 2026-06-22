import {
  comparePasswords,
  generateAccessToken,
  generateRefreshToken,
  getFileUrl,
} from '../helpers/index.js';
import { getUserByEmail } from '../models/index.js';
import { saveRefreshToken } from '../models/index.js';
import { UserEmailDoesNotExist, InvalidPassWord } from '../errors/index.js';
import type { LoginInRequestBody, JWTPayload } from '../types/index.js';

export const loginService = async ({
  correo_electronico,
  clave,
}: LoginInRequestBody) => {
  const user = await getUserByEmail(correo_electronico);

  if (!user) throw new UserEmailDoesNotExist();

  const isPasswordValid = await comparePasswords(clave, user.clave_hash);

  if (!isPasswordValid) throw new InvalidPassWord();

  const payload: JWTPayload = {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    cedula: user.cedula,
    correo: user.correo_electronico,
    roles: user.roles,
    permisos: user.permisos,
  };

  const accessToken = await generateAccessToken(payload);

  const refreshToken = await generateRefreshToken(user.id);

  await saveRefreshToken(user.id, refreshToken);

  const profileImageUrl = user.foto_url
    ? await getFileUrl(user.foto_url)
    : null;

  return {
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      cedula: user.cedula,
      correo_electronico: user.correo_electronico,
      foto_url: profileImageUrl,
      roles: user.roles,
      permisos: user.permisos,
    },
    tokens: {
      access: accessToken,
      refresh: refreshToken,
    },
  };
};
