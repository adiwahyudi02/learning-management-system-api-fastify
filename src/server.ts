import { buildApp } from './app';

const PORT = process.env.PORT || 3000;

void (async () => {
  try {
    const app = await buildApp();
    const address = await app.listen({ port: Number(PORT), host: '0.0.0.0' });
    console.log(`🚀 Server running at ${address}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
