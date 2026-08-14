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
