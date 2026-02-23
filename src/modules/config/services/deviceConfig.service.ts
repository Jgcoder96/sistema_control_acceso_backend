import { publishMessage } from '../../../mqtt/publisher/index.js';
import { TOPICS } from '../constants/index.js';
import type { RequestBodyDeviceConfig } from '../types/index.js';

export const deviceConfigService = async (
  data: RequestBodyDeviceConfig,
): Promise<void> => {
  await publishMessage(TOPICS.topicToConfigureDevice, JSON.stringify(data));
};
