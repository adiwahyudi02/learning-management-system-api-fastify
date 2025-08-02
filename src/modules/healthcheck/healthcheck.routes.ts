import { FastifyInstance } from 'fastify';
import { healthcheckHandler } from './healthcheck.controller';
import { healthcheckResponseSchema } from './healthcheck.schema';

export function healthcheckRoutes(app: FastifyInstance) {
  app.get(
    '/healthcheck',
    {
      schema: {
        description: 'Healthcheck route',
        tags: ['Healthcheck'],
        response: {
          200: healthcheckResponseSchema,
        },
      },
    },
    healthcheckHandler,
  );
}
