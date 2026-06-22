import { verifyRefreshToken, generateAccessToken } from '../helpers/index.js';
import {
  getRefreshTokenRecord,
  getUserByEmail,
  deleteRefreshToken,
} from '../models/index.js';
import { SessionExpired, InvalidToken } from '../errors/index.js';
import type { RefreshTokenInRequestBody, JWTPayload } from '../types/index.js';

export const refreshTokenService = async ({
  token,
}: RefreshTokenInRequestBody) => {
  const decoded = verifyRefreshToken(token);

  const tokenDb = await getRefreshTokenRecord(token);

  if (!tokenDb) throw new InvalidToken();

  if (decoded.id !== tokenDb.usuario_id) throw new InvalidToken();

  if (new Date() > tokenDb.expira_el) {
    await deleteRefreshToken(token);
    throw new SessionExpired();
  }

  const user = await getUserByEmail(tokenDb.usuarios.correo_electronico);

  if (!user || user.estado !== 'activo') throw new InvalidToken();

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

  return {
    access_token: accessToken,
  };
};
