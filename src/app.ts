import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { connectDB } from './config/db.config';
import { healthcheckRoutes } from './modules/healthcheck/healthcheck.routes';
import { errorHandlerPlugin } from './plugins/error.plugin';

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Connect DB (only once, on build)
  await connectDB();

  // Register middleware
  await app.register(cors);
  await app.register(helmet);
  await app.register(compress);

  // Register Swagger
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Learning Management System - Rest API',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description:
              'This token is a signed JWT used to authenticate and authorize API requests. Use your access token as a Bearer token in the Authorization header. Example: Authorization: Bearer <access_token>. When filling the "Value" field in Swagger UI, just paste the access token itself (without "Bearer" prefix).',
          },
        },
      },
    },
  });
  await app.register(swaggerUI, {
    routePrefix: '/docs',
  });

  // Register error handler
  await app.register(errorHandlerPlugin);

  // Register routes
  await app.register(healthcheckRoutes);

  return app;
}
