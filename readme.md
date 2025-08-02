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
- Sinclair/typebox (schema validation)
- Fastify Swagger (OpenAPI docs)
- Jest + Supertest (testing)

## Run the app

**1. Install dependencies**

```shell
$ npm install
```

**2. Setup environments**

Create a .env file in the root project by copying from the provided example file:

```shell
$ cp .env.example .env
```

Then adjust the values to match your local setup (e.g., database URI, JWT secret, etc.).

**3. Seed the database (optional)**

You can seed initial data (users, courses, lessons, etc.).
⚠ Make sure **NODE_ENV** is set to **development** before running:

```shell
$ npm run seed
```

**4. Run the app**

```shell
  # development
  $ npm run dev

  # production
  $ npm run build
  $ npm run start
```

## Run Test

```shell
  $ npm run test
```

## Run Linter

```shell
  $ npm run lint
```

## Run Formater

```shell
  $ npm run format
```
