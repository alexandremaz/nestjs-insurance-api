# Dockerfile
FROM node:24.20.0-alpine3.23

WORKDIR /app

COPY package.json package-lock.json nest-cli.json tsconfig.build.json tsconfig.json ./

RUN npm ci

COPY src .
COPY test .

RUN npm run build

CMD ["npm", "run", "start:dev"]
