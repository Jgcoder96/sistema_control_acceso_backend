import { encryptPassword } from '../helpers/index.js';
import { transactionToUpdateUser } from '../models/index.js';
import { uploadFile, getFileUrl } from '../helpers/index.js';
import type { RequestFile } from '../../shared/types/index.js';
import type { UserToUpdateInRequestBody } from '../types/index.js';

export const updateUserService = async (
  userId: string,
  userData: UserToUpdateInRequestBody,
  file?: RequestFile,
) => {
  const { clave, ...rest } = userData;

  let fileKey: string | undefined = undefined;

  let passwordHash: string | undefined = undefined;

  if (file) fileKey = await uploadFile(file!);

  if (clave) passwordHash = await encryptPassword(clave);

  const parsedData = {
    ...rest,
    foto_url: fileKey,
    clave_hash: passwordHash,
  };

  const updatedUser = await transactionToUpdateUser(userId, parsedData);

  const fileUrl = await getFileUrl(updatedUser.foto_url!);

  return {
    id: updatedUser.id,
    nombre: updatedUser.nombre,
    apellido: updatedUser.apellido,
    cedula: updatedUser.cedula,
    correo_electronico: updatedUser.correo_electronico,
    foto_url: fileUrl,
  };
};
