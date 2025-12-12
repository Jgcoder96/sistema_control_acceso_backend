# ==========================================
# ETAPA 1: Construcción (Builder)
# ==========================================
FROM node:lts-alpine AS builder

WORKDIR /app

# 1. Instalar dependencias del proyecto (incluyendo desarrollo)
COPY package.json package-lock.json ./
RUN npm ci

# 2. Copiar código fuente y compilar
COPY . .
RUN npm run build

# ==========================================
# ETAPA 2: Producción (Runner)
# ==========================================
FROM node:lts-alpine AS runner

# Configuración de entorno
ENV NODE_ENV=production
WORKDIR /app

# 1. Instalar únicamente dependencias de producción
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 2. Copiar los artefactos compilados desde la etapa anterior
COPY --from=builder /app/dist ./dist

# 3. Configuración de seguridad (Usuario sin privilegios)
USER node
EXPOSE 3000

# 4. Iniciar aplicación
CMD ["node", "dist/main.js"]