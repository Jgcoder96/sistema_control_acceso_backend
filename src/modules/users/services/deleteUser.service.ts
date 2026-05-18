import { transactionToDeleteUser } from '../models/index.js';

export const deleteUserService = async (userID: string) => {
  return await transactionToDeleteUser(userID);
};
