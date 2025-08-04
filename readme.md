# Learning Management System Rest API

## Description

A Rest API for managing courses, lessons, enrollments, and learner progress.

## API Specification Documentation

Interactive docs: [View on SwaggerHub](https://app.swaggerhub.com/apis/berkah/learning-management-system-rest-api/1.0.0)

(Optional) If you have run the project locally, you can also access the docs at: [http://localhost:3000/docs](http://localhost:3000/docs)

## Tech Stack

<p align="center">
  <img
      src="https://github.com/fastify/graphics/raw/HEAD/fastify-landscape-outlined.svg"
      width="350"
      height="auto"
    />
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

This is project built on top [Fastify](https://github.com/fastify/fastify) framework. A progressive Node.js framework for An efficient server implies a lower cost of the infrastructure, better responsiveness under load, and happy users.

- Fastify
- TypeScript
- MongoDB + Mongoose
- Sinclair/typebox (Schema validation)
- Fastify Swagger (OpenAPI docs)
- Jest + Supertest (Testing)
- Docker
- Github Actions
- Eslint + Prettier + Husky

## Run the app

You can run locally with Node.js, or use Docker Compose.

### Option 1: Local development

##### 1. Install Dependencies

```bash
  npm install
```

##### 2. Setup environments

Create a .env file in the root project by copying from the provided example file:

```bash
  cp .env.example .env
```

Then adjust the values to match your local setup (e.g., database URI, JWT secret, etc.).

##### 3. Seed the database (optional)

```bash
  # seed without resetting
  npm run seed

  # or seed with resetting
  npm run seed:reset
```

##### 4. Run the app

```bash
  # run in dev mode
  npm run dev

  # or build & start production build
  npm run build
  npm run start
```

### Option 2: With Docker

Docker images are published automatically to GitHub Container Registry (GHCR) through the CI/CD pipeline.

##### 1. Setup the Enviroment for Docker

Create a .env.docker file in the root project by copying from the provided example file:

```bash
  cp .env.docker.example .env.docker
```

Then adjust the values to match your local setup (e.g., database URI, JWT secret, etc.).

> **Note:** By default, the `.env.docker` uses the `latest` tag. You can change it by checking the available tags in the GitHub Packages registry.

##### 2. Docker scripts

- To start the App

```bash
  npm run docker:up
```

- To stop and remove the containers:

```bash
npm run docker:down
```

- To see logs:

```bash
npm run docker:logs
```

##### 3. Seed the database (optional)

```bash
  # seed without resetting
  npm run seed:prod

  # or seed with resetting
  npm run seed:prod:reset
```

## Run Test

```bash
  npm run test
```

## Run Linter

```bash
  npm run lint
```

## Run Formater

```bash
  npm run format
```
