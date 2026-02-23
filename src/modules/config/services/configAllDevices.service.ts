import { publishMessage } from '../../../mqtt/publisher/index.js';
import { TOPICS } from '../constants/index.js';
import type { RequestBodyConfigAllDevices } from '../types/index.js';

export const configAllDevicesService = async (
  data: RequestBodyConfigAllDevices,
): Promise<void> => {
  await publishMessage(TOPICS.topicToConfigureAllDevices, JSON.stringify(data));
};
