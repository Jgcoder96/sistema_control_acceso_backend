# 🛡️ Backend: Sistema de Control de Acceso

Esta documentación describe el núcleo del sistema de control de acceso, desarrollado con un enfoque moderno y robusto. La arquitectura es versátil y admite comunicación **multiprotocolo**, integrando conexiones vía **MQTT**, **WebSockets** y peticiones **RESTful HTTP**.

---

## 🚀 Stack Tecnológico

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MQTT](https://img.shields.io/badge/MQTT-660066?style=for-the-badge&logo=mqtt&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Docker](https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white)

---

## 📂 Repositorios del Ecosistema

| Componente      | Descripción                                            | Enlace                                                                        |
| :-------------- | :----------------------------------------------------- | :---------------------------------------------------------------------------- |
| 🔌 **Firmware** | Código fuente para los dispositivos IoT (ESP32/Otros). | [Ver en GitHub](https://github.com/Jgcoder96/sistema_control_acceso_firmware) |
| ⚙️ **Backend**  | API central, gestión de protocolos y persistencia.     | [Ver en GitHub](https://github.com/Jgcoder96/sistema_control_acceso_backend)  |
| 💻 **Frontend** | Panel de administración y visualización de datos.      | [Ver en GitHub](https://github.com/Jgcoder96)                                 |

---

## 🛠️ Instalación y Puesta en Marcha

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local.

### 1. Prerrequisitos

Asegúrate de tener instaladas las siguientes herramientas:

- **Node.js** (Versión recomendada v24.12.0)
- **Docker** (Versión recomendada v27.5.1)
- **Git**

### 2. Clonar y Preparar 📂

- **Clonar el repositorio**

```bash
git clone https://github.com/Jgcoder96/sistema_control_acceso_backend.git
```

- **Entrar en la carpeta del proyecto**

```bash
cd sistema_control_acceso_backend
```

- **Instalar dependencias**

```bash
npm install
```

### 3. Configuración de Variables de Entorno (.env) 🔐

El proyecto utiliza `dotenv` y `env-var` para gestionar la configuración. Debes crear un archivo llamado `.env` en la raíz del proyecto para que la aplicación funcione correctamente.

Puedes utilizar el archivo `.env.template` como referencia para definir los siguientes valores:

| Variable                        | Descripción                                                       |
| :------------------------------ | :---------------------------------------------------------------- |
| **Configuración de Aplicación** |                                                                   |
| `NODE_ENV`                      | Define el entorno de ejecución (ej. `development`, `production`). |
| `APP_PORT`                      | Puerto en el que se ejecutará el servidor de la aplicación.       |
| **Base de Datos (PostgreSQL)**  |                                                                   |
| `POSTGRES_USER`                 | Nombre de usuario para la conexión a la base de datos.            |
| `POSTGRES_PASSWORD`             | Contraseña del usuario de la base de datos.                       |
| `POSTGRES_DB`                   | Nombre de la base de datos a utilizar.                            |
| `POSTGRES_PORT`                 | Puerto de escucha del servicio de base de datos.                  |
| `DATABASE_URL`                  | URL completa de conexión utilizada por el ORM.                    |
| **Broker MQTT**                 |                                                                   |
| `MQTT_BROKER_URL`               | URL o dirección IP del servidor del broker MQTT.                  |
| `MQTT_BROKER_PORT`              | Puerto de conexión para el protocolo MQTT.                        |
| **Almacenamiento AWS S3**       |                                                                   |
| `AWS_ACCESS_KEY_ID`             | Identificador de la llave de acceso de AWS.                       |
| `AWS_SECRET_ACCESS_KEY`         | Llave secreta de acceso de AWS.                                   |
| `AWS_REGION`                    | Región de AWS donde se encuentra el servicio S3.                  |
| `S3_BUCKET_NAME`                | Nombre del bucket destinado al almacenamiento de archivos.        |
| **Seguridad y Autenticación**   |                                                                   |
| `JWT_SECRET`                    | Clave secreta utilizada para firmar y verificar los tokens JWT.   |

### 4. Infraestructura (Docker) 🐳

El proyecto utiliza Docker para automatizar el despliegue de los servicios necesarios en desarrollo. Al ejecutar la infraestructura, se levantarán los siguientes servicios:

- 🐘 **PostgreSQL**: Motor de base de datos relacional.
- 🦟 **Eclipse Mosquitto**: Broker de mensajería para el protocolo MQTT.

Para iniciar estos servicios, ejecuta el siguiente comando en la terminal:

```
docker compose -f docker-compose.dev.yml up -d
```

### 5. Preparar la base de datos 🗄️

Una vez creada la base de datos, sigue estos pasos para configurar la estructura y el cliente de Prisma:

- **Ejecutar el script inicial:** Ejecuta el archivo ubicado en db/script.sql en tu gestor de base de datos para generar todas las tablas y relaciones.

- **Sincronizar el esquema de Prisma:**

```bash
npx prisma db pull
```

- **Generar el cliente:**

```bash
npx prisma generate
```

### 6. Ejecución del Proyecto ⚡

El `package.json` incluye los siguientes comandos para los diferentes entornos:

| Entorno        | Comando         | Descripción                                                                              |
| :------------- | :-------------- | :--------------------------------------------------------------------------------------- |
| **Desarrollo** | `npm run dev`   | Inicia el servidor con `tsx` en modo _watch_ (reinicia al guardar cambios).              |
| **Build**      | `npm run build` | Elimina la carpeta `./dist` y compila el código TypeScript a JavaScript.                 |
| **Producción** | `npm start`     | Ejecuta el código compilado en `./dist/main.js`. Requiere haber ejecutado `build` antes. |

## 📖 Documentación de la API (Swagger)

Una vez que el servidor esté en funcionamiento, puedes acceder a la documentación interactiva de la API a través de **Swagger UI**. Esta interfaz permite visualizar todos los endpoints disponibles, sus esquemas de datos y realizar pruebas de peticiones directamente desde el navegador.

La documentación está disponible en la siguiente ruta:

- **URL Local:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

> **Nota:** Asegúrate de que la aplicación esté corriendo (`npm run start:dev` o el comando correspondiente) antes de intentar acceder. Si has cambiado el valor de `APP_PORT` en tu archivo `.env`, deberás ajustar la URL con el puerto configurado.

## 🏗️ Construcción y Despliegue de Imágenes Docker

Pasos necesarios para compilar la aplicación, generar la etiqueta de versión y subirla al registro de contenedores (Docker Hub).

1. **Construir la Imagen (Build)**
   _Crea la imagen a partir del Dockerfile en el directorio actual._

   ```bash
   docker build -t <NOMBRE_IMAGEN> .
   ```

2. **Etiquetar la Imagen (Tag)**
   _Prepara la imagen para subirla, asignándole el usuario y la versión._
   ```bash
   docker tag <NOMBRE_IMAGEN> <USUARIO_DOCKERHUB>/<NOMBRE_IMAGEN>:<VERSION>
   ```
3. **Subir la Imagen (Push)**
   _Envía la imagen etiquetada a Docker Hub._

   ```bash
   docker push <USUARIO_DOCKERHUB>/<NOMBRE_IMAGEN>:<VERSION>
   ```
