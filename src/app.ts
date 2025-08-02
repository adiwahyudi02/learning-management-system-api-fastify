import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Register middleware
  await app.register(cors);
  await app.register(helmet);
  await app.register(compress);

  return app;
}
