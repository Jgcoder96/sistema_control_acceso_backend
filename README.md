# Backend: Sistema de Control de Acceso

Esta documentación describe el backend del sistema de control de acceso, desarrollado en **Node.js** utilizando **TypeScript**. La arquitectura del sistema es versátil y admite comunicación multiprotocolo, integrando conexiones vía **MQTT**, **WebSockets** y peticiones **HTTP**. Asimismo, utiliza **PostgreSQL** como motor de base de datos para garantizar una persistencia de datos.

## 📂 Repositorios y Recursos

| Componente   | Descripción                             | Enlace                                                                        |
| :----------- | :-------------------------------------- | :---------------------------------------------------------------------------- |
| **Firmware** | Código fuente del firmware del sistema. | [Ver en GitHub](https://github.com/Jgcoder96/sistema_control_acceso_firmware) |
| **Backend**  | Código fuente del backend del sistema.  | [Ver en GitHub](https://github.com/Jgcoder96/sistema_control_acceso_backend)  |
| **Frontend** | Código fuente del frontend del sistema. | [Ver en GitHub](https://github.com/Jgcoder96)                                 |

## 🚀 Stack Tecnológico

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MQTT](https://img.shields.io/badge/MQTT-660066?style=for-the-badge&logo=mqtt&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Docker](https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white)

## 📚 Librerías y Dependencias

| Paquete     | Versión  | Descripción Técnica                           |
| :---------- | :------: | :-------------------------------------------- |
| `express`   | `5.1.0`  | Manejo de endpoints HTTP y middleware.        |
| `mqtt`      | `5.14.1` | Cliente para conexión con Broker MQTT.        |
| `socket.io` | `4.8.1`  | Comunicación bidireccional en tiempo real.    |
| `env-var`   | `7.5.0`  | Validación y tipado de variables de entorno.  |
| `morgan`    | `1.10.1` | Logger de peticiones HTTP.                    |
| `cors`      | `2.8.5`  | Habilita peticiones de origen cruzado (CORS). |

## 🛠️ Instalación y Puesta en Marcha

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local.

### 1. Prerrequisitos

Asegúrate de tener instalado lo siguiente antes de comenzar:

- **Node.js** (Versión recomendada v24.12.0).
- **Docker** (Versión recomendada v27.5.1).
- **Git** (Para clonar el repositorio).

### 2. Clonar e Instalar

Clona el repositorio e instala las dependencias:

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

### 3. Configuración de Variables de Entorno (.env)

El proyecto utiliza `dotenv` y `env-var` para gestionar la configuración. Debes crear un archivo llamado `.env` en la raíz del proyecto.

Puedes duplicar el archivo `.env.template` como base y definir los siguientes valores:

| Variable           | Descripción                                                   | Ejemplo            |
| :----------------- | :------------------------------------------------------------ | :----------------- |
| `APP_PORT`         | Puerto en el que se ejecutará el servidor de la aplicación.   | `3000`             |
| `NODE_ENV`         | Define el entorno de ejecución (ej. development, production). | `development`      |
| `MQTT_BROKER_URL`  | La URL de conexión para el broker MQTT.                       | `mqtt://localhost` |
| `MQTT_BROKER_PORT` | El puerto de conexión para el broker MQTT.                    | `1883`             |

### 4. Infraestructura (Docker)

Para el correcto funcionamiento del sistema, es necesario levantar el servicio de mensajería Eclipse Mosquitto. Ejecuta el siguiente comando:

```
docker compose -f docker-compose.dev.yml up -d
```

### 5. Ejecución del Proyecto

El `package.json` incluye los siguientes comandos para los diferentes entornos:

| Entorno        | Comando         | Descripción                                                                              |
| :------------- | :-------------- | :--------------------------------------------------------------------------------------- |
| **Desarrollo** | `npm run dev`   | Inicia el servidor con `tsx` en modo _watch_ (reinicia al guardar cambios).              |
| **Build**      | `npm run build` | Elimina la carpeta `./dist` y compila el código TypeScript a JavaScript.                 |
| **Producción** | `npm start`     | Ejecuta el código compilado en `./dist/main.js`. Requiere haber ejecutado `build` antes. |

## 🐳 Construcción y Despliegue de Imágenes Docker

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
