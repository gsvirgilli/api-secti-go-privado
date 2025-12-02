FROM node:20-alpine

RUN apk add --no-cache curl


WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
COPY entrypoint-migrations.sh ./entrypoint-migrations.sh

# Dá permissão de execução para o script
RUN chmod +x ./entrypoint-migrations.sh
EXPOSE 3333
# Run in production mode com migrações
ENTRYPOINT [ "./entrypoint-migrations.sh" ]
CMD ["npm", "start"]