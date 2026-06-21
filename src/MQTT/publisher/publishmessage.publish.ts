import { getClient } from '../connection/index.js';
import { publishDataError } from '../errors/index.js';
import { logger } from '../../config/index.js';

export const publishMessage = async (
  topic: string,
  message: string,
): Promise<void> => {
  const client = getClient();

  if (!client || !client.connected) {
    logger.error('[MQTT - PUBLISHER] Error al publicar.');
    throw new publishDataError();
  }

  await client.publishAsync(topic, message);
};
