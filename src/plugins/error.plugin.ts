import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

export const errorHandlerPlugin = fp(function (app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    // Handle validation errors
    if ('validation' in error) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    // Other errors
    reply.status(error.statusCode || 500).send({
      message: error.message || 'Internal Server Error',
    });
  });
});
