import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trabajo Especial de Grado',
      version: '1.0.0',
      description: `
## Documentación de la API: Sistema de Control de Acceso

*   **Autor:** Br. José Pérez
*   **Tutor:** Ing. Iván Gutiérrez
      `,
      contact: {
        name: 'jgcoder96',
      },
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Introduce el token JWT obtenido en el login para acceder a los endpoints protegidos.',
        },
      },
    },

    tags: [
      {
        name: 'Iniciar Sesión',
      },
      {
        name: 'Usuarios',
      },
      {
        name: 'Roles',
      },
      {
        name: 'Permisos de App',
      },
      {
        name: 'Tarjetas de Acceso',
      },
      {
        name: 'Ubicaciones',
      },
      {
        name: 'Puntos de Acceso',
      },
      {
        name: 'Horarios',
      },
      {
        name: 'Feriados',
      },
      {
        name: 'Permisos Físicos',
      },
      {
        name: 'Logs',
      },
    ],
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo',
      },
    ],
  },

  apis: [
    path.join(__dirname, './end-points/*.ts'),
    path.join(__dirname, './end-points/*.js'),
    path.join(__dirname, './end-points/**/*.yml'),
  ],
};

export const swaggerConfig = swaggerJSDoc(options);
