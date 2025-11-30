## Project setup

```bash
# install nvm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# install node
$ nvm install

# install dependencies
$ npm i
```

## Environment Variables Required (in .env file)

- `ADMIN_API_KEY`: The API key for the admin user
- `JWT_SECRET`: The secret to verify the authenticity of the JWT token bearers
- `DATABASE_URL`: The URL of the database

## Project description

This is an insurance API built with NestJS that allows partners to manage customers and their insurance claims. The API uses a three-tier authentication system:
1. Admin API key for partner creation
2. Partner API key for authentication
3. JWT tokens for subsequent requests

# API Documentation

The full API documentation is available via Swagger UI at `/api` when the application is running (localhost:3000/api) : `npm run start:dev`
don't forget to set the correct environment variables in the .env file
and don't forget to run the docker compose file to have a database available : `docker compose up -d elastic db`

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests : a bit useless for now, but useful for future development (I didn't have time to implement them)
$ npm run test

# e2e tests : useful to test the API, just up the db and elastic containers before running the tests 
$ docker compose up -d db elastic
$ npm run test:e2e

# test coverage : useful to see the code coverage of the tests, but not very useful for now (I didn't have time to implement enough unit tests)
$ npm run test:cov
```

# How to use the API

## Create a partner (set x-admin-api-key in the header)

```bash
$ curl -X POST http://localhost:3000/auth/create-partner -H "x-admin-api-key: my_admin_api_key" -H "Content-Type: application/json" -d '{"partnerName": "A Partner"}'
```

the response will contain the partner's API key which looks like `pk_<uuid>`

## Login a partner (set x-api-key in the header with the partner's API key previously created)

```bash
$ curl -X GET http://localhost:3000/auth/login -H "x-api-key: pk_<uuid>"
```

the response will contain a JWT token which will be used to authenticate the partner in the other endpoints

## Create a customer (set bearer in the header with the JWT token previously created)

```bash
$ curl -X POST http://localhost:3000/customers -H "Authorization: Bearer <jwt-token>" -H "Content-Type: application/json" -d '{"name": "test", "email": "test@test.com"}'
```

the response will contain the created customer with an id
