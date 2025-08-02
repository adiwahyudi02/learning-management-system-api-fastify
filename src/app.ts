import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import { connectDB } from './config/db.config';
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

  return app;
}
