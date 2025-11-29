import { appExpress } from './app/app.js';
import { envs } from './config/envs.js';

const main = () => {
  const app = appExpress();

  const PORT = envs.PORT;

  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
};

(async () => {
  main();
})();
