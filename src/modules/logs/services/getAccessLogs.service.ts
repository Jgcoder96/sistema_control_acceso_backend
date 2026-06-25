import { getAccessLogs as getAccessLogsModels } from '../models/index.js';
import type { AccessLogsFilters } from '../types/index.js';
import { getFileUrl } from '../../users/helpers/s3.helper.js';

export const getAccessLogsService = async (filters: AccessLogsFilters) => {
  const logs = await getAccessLogsModels(filters);

  const dataWithUrls = await Promise.all(
    logs.data.map(async (log) => {
      if (log.tarjeta?.usuario?.foto) {
        const urlFirmada = await getFileUrl(log.tarjeta.usuario.foto);

        return {
          ...log,
          tarjeta: {
            ...log.tarjeta,
            usuario: {
              ...log.tarjeta.usuario,
              foto: urlFirmada,
            },
          },
        };
      }

      return log;
    }),
  );

  return {
    ...logs,
    data: dataWithUrls,
  };
};
