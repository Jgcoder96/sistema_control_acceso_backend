import { envs } from '../../config/index.js';
import { getClient } from '../connection/index.js';
import { logger } from '../../config/index.js';
import { macToBuffer } from '../helpers/index.js';
import pkg from 'pg';

import { PUBLICATIONS_TOPICS } from '../constants/index.js';

const { Client } = pkg;

export const accessPointsTableListener = async () => {
  const dbClient = new Client({ connectionString: envs.DATABASE_URL });

  try {
    await dbClient.connect();
    await dbClient.query('LISTEN device_desync');

    logger.info(
      '[DB-Watcher] Establecida escucha de eventos en tiempo real (PostgreSQL).',
    );

    dbClient.on('notification', (msg) => {
      if (msg.channel === 'device_desync' && msg.payload) {
        const mqtt = getClient();

        if (mqtt && mqtt.connected) {
          try {
            const data = JSON.parse(msg.payload);

            const bufferMeshId = macToBuffer(data.mesh_id);
            const bufferMac = macToBuffer(data.mac);

            const payload = {
              type: 'sync_trigger',
              mesh_id: bufferMeshId.toString('base64'),
              mac: bufferMac.toString('base64'),
              execute: true,
            };

            mqtt.publish(
              PUBLICATIONS_TOPICS.DEVICE_SYNC_TRIGGER,
              JSON.stringify(payload),
              {
                qos: 1,
              },
            );

            console.info(`[DB-Notify] Gatillo enviado | MAC: ${data.mac}`);
          } catch (parseError) {
            logger.error(
              `[DB-Watcher] Error parseando notificación de DB | Motivo: ${parseError}.`,
            );
          }
        } else {
          logger.warn('⚠️ DB-Watcher: MQTT no disponible.');
        }
      }
    });

    dbClient.on('error', (err) => {
      logger.error(`[DB-Watcher] Error de conexión | Motivo: ${err.message}.`);
      setTimeout(accessPointsTableListener, 5000);
    });
  } catch (error) {
    logger.error(`[DB-Watcher] Error al iniciar | Motivo: ${error}.`);
    setTimeout(accessPointsTableListener, 5000);
  }
};
