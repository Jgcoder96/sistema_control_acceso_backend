import { prisma } from '../../config/index.js';
import { logger } from '../../config/index.js';

interface SyncSuccessfulPayload {
  type: string;
  version: number;
  success: boolean;
  device_mac: string;
  mesh_id: string;
}

export const handleDeviceSyncSuccessful = async (message: Buffer) => {
  try {
    const payload: SyncSuccessfulPayload = JSON.parse(message.toString());

    if (!payload.success) {
      logger.warn(
        `[MQTT - SYNC SUCCESSFULL] El dispositivo ${payload.device_mac} reportó un fallo en la escritura NVS (Memoria interna).`,
      );
      return;
    }

    // Actualizamos la base de datos
    const updatedDevice = await prisma.puntos_acceso.update({
      where: {
        mac: payload.device_mac,
      },
      data: {
        esta_sincronizado: true,
      },
    });

    // Log estructurado de éxito
    logger.info(
      `[MQTT - SYNC SUCCESSFULL] Sincronización confirmada en base de datos`,
      {
        nombre: updatedDevice.nombre,
        mac: payload.device_mac,
        version_confirmada: payload.version,
      },
    );
  } catch (error) {
    logger.error(
      `[MQTT - SYNC SUCCESSFULL] Error procesando el ACK (confirmación) de sincronización: ${(error as Error).message}`,
      { stack: (error as Error).stack },
    );
  }
};
