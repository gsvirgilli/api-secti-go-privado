FROM node:18-alpine

RUN apk add --no-cache curl


WORKDIR /usr/app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3333
# Run in dev mode with ts-node ESM loader
ENTRYPOINT [ "npm", "run" ]
CMD ["dev"]