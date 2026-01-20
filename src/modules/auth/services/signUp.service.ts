import { createUser } from '../models/index.js';
import { encryptPassword } from '../helpers/index.js';
import { uploadFile, getFileUrl } from '../helpers/index.js';
import type { RequestBodySignUp } from '../types/index.js';
import type { RequestFile } from '../../../shared/types/index.js';

export const signUpService = async (
  userData: RequestBodySignUp,
  file?: RequestFile,
) => {
  const { clave, ...rest } = userData;

  const fileKey = await uploadFile(file!);

  const passwordHash = await encryptPassword(clave);

  const parsedData = {
    ...rest,
    cedula: Number(userData.cedula),
    foto_url: fileKey,
    clave_hash: passwordHash,
  };

  const newUser = await createUser(parsedData);

  const fileUrl = await getFileUrl(fileKey);

  return {
    id: newUser.id,
    nombre: newUser.nombre,
    apellido: newUser.apellido,
    correo_electronico: newUser.correo_electronico,
    foto_url: fileUrl,
  };
};
