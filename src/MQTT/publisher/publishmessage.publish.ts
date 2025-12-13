import { getClient } from '../connection/mqttClient.connection.js';

export const publishMessage = (
  topic: string,
  message: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const client = getClient();

    if (!client || !client.connected) {
      return reject(new Error('El cliente MQTT no está conectado.'));
    }

    client.publish(topic, message, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
