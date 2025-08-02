import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

export const jwtPlugin = fp(function (app) {
  app.register(fastifyJwt, {
    secret: process.env.ACCESS_TOKEN_SECRET!,
  });
});
