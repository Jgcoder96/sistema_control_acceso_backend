import { getUsers as getUsersModel } from '../models/index.js';
import type { UserFilters } from '../types/index.js';
import { getFileUrl } from '../helpers/s3.helper.js';

export const getUsersService = async (filters: UserFilters) => {
  const users = await getUsersModel(filters);
  const updateImageUrl = await Promise.all(
    users.data.map(async (user) => {
      if (user.foto_url) {
        const nuevaUrl = await getFileUrl(user.foto_url);
        return {
          ...user,
          foto_url: nuevaUrl,
        };
      }
      return user;
    }),
  );

  const updatedUsers = {
    ...users,
    data: updateImageUrl,
  };

  return updatedUsers;
};
