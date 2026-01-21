import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend: sistema control acceso',
      version: '1.0.0',
      description: 'Documentación de la API del sistema de control de acceso',
      contact: {
        name: 'jgcoder96',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo',
      },
    ],
  },

  apis: [
    path.join(__dirname, './routes/*.ts'),
    path.join(__dirname, './routes/*.js'),
    path.join(__dirname, './routes/**/*.yml'),
  ],
};

export const swaggerConfig = swaggerJSDoc(options);
