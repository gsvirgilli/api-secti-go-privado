FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --legacy-peer-deps

COPY backend/src ./src
COPY backend/tsconfig.json ./

RUN npm run build 2>/dev/null || true

EXPOSE 3000

CMD ["node", "--import", "tsx/esm", "src/server.ts"]
