import bcrypt from 'bcryptjs';

export const comparePasswords = async (
  receivedPassword: string,
  passwordHash: string,
): Promise<boolean> => {
  const pass = await bcrypt.compare(receivedPassword, passwordHash);
  return pass;
};
