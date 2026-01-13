import { createUser } from '../models/createUser.model.js';
import { encryptPassword } from '../helpers/encryptPassword.helper.js';
import { uploadFile, getFileUrl } from '../helpers/s3.helper.js';
import type { RequestBodySignUp } from '../types/RequestBodySignUp.type.js';
import type { RequestFile } from '../../../shared/types/RequestFile.type.js';

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
