import { createServer } from 'http';

import { appExpress } from './app/app.js';
import { envs } from './config/envs.js';
import { initWss } from './websocket/index.js';

const main = (): void => {
  const app = appExpress();

  const httpServer = createServer(app);

  initWss(httpServer);

  const PORT = envs.PORT || 3000;

  httpServer.listen(PORT, () => {
    console.log(
      `Servidor HTTP: http://localhost:${PORT} \nWebSocket: ws://localhost:${PORT}`,
    );
  });
};

(async () => {
  main();
})();
