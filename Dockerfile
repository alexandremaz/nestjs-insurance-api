# Dockerfile
FROM node:22.20.0-alpine3.22

WORKDIR /app

COPY package.json package-lock.json nest-cli.json tsconfig.build.json tsconfig.json ./

RUN npm ci

COPY src .
COPY test .

RUN npm run build

CMD ["npm", "run", "start:dev"]
