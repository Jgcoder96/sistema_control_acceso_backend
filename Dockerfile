# ETAPA 1: Construcción (Builder)
FROM node:22-alpine3.21 AS builder

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./ 

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

# ETAPA 2: Producción (Runner)
FROM node:22-alpine3.21 AS runner

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# 1. Copiamos los archivos asignando la propiedad al usuario 'node' desde el inicio
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/prisma.config.ts ./ 
COPY --from=builder --chown=node:node /app/package.json ./package.json

# 2. Creamos la carpeta de logs y aseguramos que el usuario node sea el dueño
RUN mkdir -p /app/logs && chown -R node:node /app/logs

USER node
EXPOSE 3000

# Asegúrate de que el usuario node tenga permisos para ejecutar npx prisma
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]