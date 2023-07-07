# User Management System API

This is a REST API for a user management system. It allows users to be created, updated, deleted, and retrieved. The API also allows users to be authenticated using JWT tokens.

## Technologies Used

- Typescript
- NestJS
- Postgres
- TypeORM
- Jest
- Supertest
- ESLint
- Prettier
- Class-validator

## Installation

To install the necessary dependencies, run the following command:

```BASH
npm install
```

## Setup

To run this app, you will need to create a `.env` file in the root directory with the following variables:

```DOTENV
# Port the app will run on, defaults to 3000 if not set
PORT=5555
# Database connection variables
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=test
DB_PASSWORD=test
DB_DATABASE=postgres
# JWT secret key
JWT_SECRET_KEY=secret
# JWT token expiration time in seconds
JWT_EXPIRATION_TIME=3600s
# Admin password for JWT token generation
ADMIN_PASSWORD=admin
```

You will also need to create a Postgres database with the name specified in the `.env` file.

The database will need to have the following table:

```SQL
create table "user"
(
    id       uuid         not null
        primary key,
    name     varchar(100) not null,
    email    varchar(100) not null,
    password varchar(100) not null
);

```

## Running the App

To run the app in development mode, use the following command:

```BASH
npm run start
```

To run the app in watch mode, use the following command:

```BASH
npm run start:dev
```

To run the app in production mode, use the following commands:

```BASH
npm run build
npm run start:prod
```

## Authentication
### Admin Authentication

To authenticate with the API, send a POST request to the `/auth/login` endpoint with the following JSON payload:

```JSON
{
  "username": "admin",
  "password": "<ADMIN_PASSWORD>"
}
```

Replace `<ADMIN_PASSWORD>` with the value of the `ADMIN_PASSWORD` variable in your `.env` file.

The API will respond with a JWT token that can be used to authenticate subsequent requests. Include the token in the `Authorization` header of your requests as follows:

```HTTP
Authorization: Bearer <JWT_TOKEN>
```

Replace `<JWT_TOKEN>` with the JWT token returned by the `/auth/login` endpoint.

### User Authentication
If the database has some user data in it, you can authenticate as a user by sending a POST request to the `/auth/login` endpoint with the following JSON payload:

```JSON
{
  "username": "<USERNAME>",
  "password": "<PASSWORD>"
}
```

## Using the App
Once the app is running you can use the following endpoints to interact with it:

 - /API - Swagger documentation for the api
 - /users - GET - Get all users
 - /users - POST - Create a new user
 - /users/:id - GET - Get a user by id
 - /users/:id - PUT - Update a user by id
 - /users/:id - DELETE - Delete a user by id
 - /auth/login - POST - Login and get a JWT token


## Swagger Documentation
The swagger documentation can be found at the /API endpoint once the app is running.

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
## End-to-end tests
End-to-end tests are run using Jest and Supertest. The tests will run on the database specified in the .env file.
It is recommended to use a test database for this.
```bash
$ npm run test:e2e
```


## Test Coverage
| File                   | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s   |
|------------------------|-----------|------------|-----------|-----------|---------------------|
| All files              | 75        | 90         | 88.46     | 75.57     |                     |
| src                    | 0         | 100        | 0         | 0         |                     |
| app.module.ts          | 0         | 100        | 0         | 0         | 1-30                |
| main.ts                | 0         | 100        | 0         | 0         | 1-21                |
| src/auth               | 82.35     | 90         | 87.5      | 82.97     |                     |
| auth.controller.ts     | 100       | 100        | 100       | 100       |                     |
| auth.guard.ts          | 100       | 80         | 100       | 100       | 35                  |
| auth.module.ts         | 0         | 100        | 0         | 0         | 1-27                |
| auth.service.ts        | 100       | 100        | 100       | 100       |                     |
| src/dto                | 100       | 100        | 100       | 100       |                     |
| createUser.dto.ts      | 100       | 100        | 100       | 100       |                     |
| signIn.dto.ts          | 100       | 100        | 100       | 100       |                     |
| updateUser.dto.ts      | 100       | 100        | 100       | 100       |                     |
| src/typeorm            | 100       | 100        | 100       | 100       |                     |
| index.ts               | 100       | 100        | 100       | 100       |                     |
| user.entity.ts         | 100       | 100        | 100       | 100       |                     |
| src/users              | 82.22     | 100        | 100       | 83.33     |                     |
| users.controller.ts    | 100       | 100        | 100       | 100       |                     |
| users.module.ts        | 0         | 100        | 100       | 0         | 1-14                |
| users.service.ts       | 100       | 100        | 100       | 100       |                     |

