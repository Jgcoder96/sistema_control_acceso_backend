import bcrypt from 'bcryptjs';

export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const passwordEncrypt = await bcrypt.hash(password, salt);
  return passwordEncrypt;
};
