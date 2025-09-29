FROM node:18-alpine

RUN apk add --no-cache curl


WORKDIR /usr/app
COPY package*.json ./
RUN npm i
COPY . .
COPY entrypoint.sh ./entrypoint.sh

# Dá permissão de execução para o script
RUN chmod +x ./entrypoint.sh
EXPOSE 3333
# Run in dev mode with ts-node ESM loader
ENTRYPOINT [ "./entrypoint.sh" ]
CMD ["npm","run","dev"]