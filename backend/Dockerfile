FROM node:18-alpine

# Instalar apenas ferramentas essenciais
RUN apk add --no-cache curl

WORKDIR /usr/app

# Copiar package.json primeiro para otimizar cache
COPY package.json package-lock.json .npmrc ./

# Instalar dependências
RUN npm install --legacy-peer-deps

# Copiar código da aplicação
COPY . .

# Expor porta do backend
EXPOSE 5000

# Comando de inicialização (tsx compila TypeScript on-the-fly)
CMD ["npm", "run", "dev"]