# Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY nest-cli.json .
COPY tsconfig.build.json .
COPY tsconfig.json .

RUN corepack enable

RUN yarn install --immutable

COPY src .
COPY test .

RUN yarn build

CMD ["yarn", "start:dev"]
