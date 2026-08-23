import { Buffer } from 'buffer';
import { saveAccessLog } from '../models/index.js';
import { logger } from '../../config/index.js';
import { getWss } from '../../websocket/index.js';
import { getFileUrl } from '../../modules/users/helpers/index.js';

export interface DeviceAccessPayload {
  card_id: string;
  access_granted: boolean;
  date: string;
  device_mac: string;
  mesh_id: string;
}

const parseDeviceDate = (dateStr: string): Date => {
  const match = dateStr.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/,
  );

  if (!match) {
    return new Date();
  }

  const day = match[1]!.padStart(2, '0');
  const month = match[2]!.padStart(2, '0');
  const year = match[3]!;
  const hour = match[4]!.padStart(2, '0');
  const minute = match[5]!.padStart(2, '0');
  const second = match[6]!.padStart(2, '0');

  const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}-04:00`;
  return new Date(isoString);
};

export const handleDeviceAccessEvent = async (
  message: Buffer,
): Promise<void> => {
  try {
    const payload: DeviceAccessPayload = JSON.parse(message.toString());

    const savedLog = await saveAccessLog({
      cardCode: payload.card_id,
      mac: payload.device_mac,
      authorized: payload.access_granted,
      date: parseDeviceDate(payload.date),
    });

    try {
      const wss = getWss();

      const usuario = savedLog.tarjetas?.usuarios;
      let realFotoUrl = null;
      if (usuario && usuario.foto_url) {
        realFotoUrl = await getFileUrl(usuario.foto_url);
      }

      const formattedLog = {
        id: savedLog.id,
        autorizado: savedLog.autorizado,
        fecha: savedLog.fecha,
        punto_acceso: savedLog.puntos_acceso.nombre,
        ubicacion: savedLog.puntos_acceso.ubicaciones.nombre,
        usuario: usuario
          ? {
              nombreCompleto: `${usuario.nombre} ${usuario.apellido}`,
              foto_url: realFotoUrl,
            }
          : null,
      };

      wss.emit('access_event', formattedLog);
    } catch (wsError) {
      logger.error(`[WebSocket] Error emitiendo evento de acceso: ${wsError}`);
    }
  } catch (error) {
    logger.error(
      `[MQTT - ACCESS EVENT] Error al guardar el evento de lectura | Motivo: ${error}.`,
    );
  }
};
