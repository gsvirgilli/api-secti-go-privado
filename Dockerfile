FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /usr/app

# Se existe arquivo em backend/, é o backend
# Se existe arquivo em frontend/, é o frontend

# Tentar backend primeiro
RUN if [ -f "backend/package.json" ]; then \
    echo "Building backend..."; \
    cd backend && \
    npm cache clean --force && \
    npm install --legacy-peer-deps && \
    npm install zod@4.1.12 --legacy-peer-deps && \
    cd /usr/app && \
    cp -r backend/src backend/node_modules backend/.env* . 2>/dev/null || true; \
elif [ -f "frontend/package.json" ]; then \
    echo "Building frontend..."; \
    cd frontend && \
    npm install && \
    npm run build && \
    cd /usr/app && \
    cp -r frontend/dist . && \
    npm install -g serve; \
fi

EXPOSE 3000

# Verificar qual é e rodar apropriadamente
CMD if [ -f "src/server.ts" ] || [ -f "dist/index.html" ]; then \
    if [ -f "src/server.ts" ]; then \
      node --import tsx/esm src/server.ts; \
    else \
      serve -s dist -l 3000; \
    fi; \
  else \
    echo "Erro: nem backend nem frontend detectados"; exit 1; \
  fi
