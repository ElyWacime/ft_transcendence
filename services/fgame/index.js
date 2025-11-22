const fastify = require('fastify')({ logger: true });

// Enable CORS so the client (Vite dev server) can call this API
fastify.register(require('@fastify/cors'), {
  origin: true
});

fastify.get('/', async (request, reply) => {
  return { message: 'Hello from Fastify!' };
});

// POST /multiply - accepts JSON { count: number } and returns { count: number }
fastify.post('/multiply', async (request, reply) => {
  const { count } = request.body || {};
  const n = Number(count) || 1;
  const result = n * 10;
  console.log(`Received count: ${n}, responding with: ${result}`);
  return { count: result };
});

// POST /divide - accepts JSON { count: number } and returns { count: number }
fastify.post('/divide', async (request, reply) => {
  const { count } = request.body || {};
  const n = Number(count) || 1;
  const result = n / 10;
  console.log(`Received count: ${n}, responding with: ${result}`);
  return { count: result };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info('Server listening on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
