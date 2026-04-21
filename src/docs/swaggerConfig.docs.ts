import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TEG: Documentación de la API.',
      version: '1.0.0',
      description:
        'Esta API REST actúa como el motor central del sistema de control de acceso, permitiendo la gestión integral de usuarios, credenciales, ubicaciones y puntos de entrada. Asimismo, facilita la administración de horarios, permisos y la configuración técnica de los dispositivos. La documentación, basada en el estándar OpenAPI mediante Swagger, ofrece una interfaz interactiva que optimiza la exploración, prueba y consumo de los diversos endpoints por parte del desarrollador.',
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
