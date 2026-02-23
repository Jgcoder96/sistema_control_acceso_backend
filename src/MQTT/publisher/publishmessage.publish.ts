import { getClient } from '../connection/mqttClient.connection.js';
import { publishDataError } from '../errors/index.js';

export const publishMessage = async (
  topic: string,
  message: string,
): Promise<void> => {
  const client = getClient();

  if (!client || !client.connected) {
    throw new publishDataError();
  }

  await client.publishAsync(topic, message);
};
