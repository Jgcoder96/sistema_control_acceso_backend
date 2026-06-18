import { Buffer } from 'buffer';
import { saveAccessLog } from '../models/saveAccessLog.model.js';

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

  // Añadimos el signo '!' después de cada índice para asegurar que son strings
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

    console.info(
      `📥 Evento de acceso: Tarjeta ${payload.card_id} en ${payload.device_mac}`,
    );

    await saveAccessLog({
      cardCode: payload.card_id,
      mac: payload.device_mac,
      authorized: payload.access_granted,
      date: parseDeviceDate(payload.date),
    });

    console.info('✅ Registro guardado en base de datos.');
  } catch (error) {
    console.error(
      '🚨 Error en handleDeviceAccessEvent:',
      error instanceof Error ? error.message : error,
    );
  }
};
