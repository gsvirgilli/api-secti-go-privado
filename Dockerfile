FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /app

# Copiar package.json do backend
COPY backend/package.json backend/package-lock.json ./

# Instalar dependências
RUN npm cache clean --force && \
    npm install --legacy-peer-deps && \
    npm install zod@4.1.12 --legacy-peer-deps

# Copiar source code do backend
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Compilar TypeScript
RUN npm run build

EXPOSE 3000

# Rodar servidor
CMD ["node", "--import", "tsx/esm", "src/server.ts"]
