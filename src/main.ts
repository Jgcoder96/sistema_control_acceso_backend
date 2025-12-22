import { createServer } from 'http';

import { appExpress } from './app/app.js';
import { envs } from './config/envs.config.js';
import { initWss } from './websocket/index.js';

const main = (): void => {
  const app = appExpress();

  const httpServer = createServer(app);

  initWss(httpServer);

  const PORT = envs.PORT || 3000;

  httpServer.listen(PORT, () => {
    // http://localhost:${PORT}
    // ws://localhost:${PORT}
  });
};

(async () => {
  main();
})();
