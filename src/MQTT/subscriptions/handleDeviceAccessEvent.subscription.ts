import { Buffer } from 'buffer';
import { saveAccessLog } from '../models/index.js';
import { logger } from '../../config/index.js';

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

  const day = parseInt(match[1]!, 10);
  const month = parseInt(match[2]!, 10);
  const year = parseInt(match[3]!, 10);
  const hour = parseInt(match[4]!, 10);
  const minute = parseInt(match[5]!, 10);
  const second = parseInt(match[6]!, 10);

  return new Date(year, month - 1, day, hour, minute, second);
};

export const handleDeviceAccessEvent = async (
  message: Buffer,
): Promise<void> => {
  try {
    const payload: DeviceAccessPayload = JSON.parse(message.toString());

    await saveAccessLog({
      cardCode: payload.card_id,
      mac: payload.device_mac,
      authorized: payload.access_granted,
      date: parseDeviceDate(payload.date),
    });
  } catch (error) {
    logger.error(
      `[MQTT - ACCESS EVENT] Error al guardar el evento de lectura | Motivo: ${error}.`,
    );
  }
};
