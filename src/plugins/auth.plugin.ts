import fp from 'fastify-plugin';
import { FastifyReply, FastifyRequest } from 'fastify';

export const authPlugin = fp(function (app) {
  app.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.send(err);
      }
    },
  );

  app.decorate(
    'authorizeRole',
    function (...roles: Array<'admin' | 'learner'>) {
      return async (request: FastifyRequest, reply: FastifyReply) => {
        if (!request.user || !roles.includes(request.user.role)) {
          return reply
            .status(403)
            .send({ message: 'Forbidden: insufficient role' });
        }
      };
    },
  );
});
