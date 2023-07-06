
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Setup

To run this app you will need to create a .env file in the root directory with the following variables:

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

```


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build 
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
## End to end tests
*e2e tests only work with a running database as defined by the env file with an empty user table*
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

