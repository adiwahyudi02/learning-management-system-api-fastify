import { JWT } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;

    authorizeRole: (
      ...roles: Array<'admin' | 'learner'>
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
export type UserPayload = {
  id: string;
  role: 'admin' | 'learner';
  iat: number;
  exp: number;
};

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserPayload;
  }
}
