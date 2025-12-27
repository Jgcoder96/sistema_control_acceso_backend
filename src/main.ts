import { createServer } from 'http';
import { appExpress } from './app/app.js';
import { envs } from './config/envs.config.js';
import { initWss } from './websocket/index.js';
import { logger } from './config/logger.config.js';

const main = (): void => {
  const app = appExpress();

  const httpServer = createServer(app);

  initWss(httpServer);

  const PORT = envs.PORT || 3000;

  httpServer.listen(PORT, () => {
    logger.info(`Servidor iniciado`);
    // http://localhost:${PORT}
    // ws://localhost:${PORT}
  });
};

(async () => {
  main();
})();
