FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /usr/app

# Copiar apenas package files primeiro
COPY package.json package-lock.json .npmrc ./

# Instalar com legacy-peer-deps
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copiar resto do código
COPY . .

# Verificar que zod foi instalado
RUN test -f node_modules/zod/package.json || (echo "ERROR: zod not installed!" && exit 1)

EXPOSE 3333

CMD ["node", "--import", "tsx/esm", "src/server.ts"]