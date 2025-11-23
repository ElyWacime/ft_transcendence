const fastify = require('fastify')({ logger: false });

class GameState {
  constructor() {
    this.Mode = 0;

    this.ball = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      radius: 10,
    };
    this.paddle1 = { x: 0, y: 0, width: 0, height: 0 };
    this.paddle2 = { x: 0, y: 0, width: 0, height: 0 };
    this.paddle3 = { x: 0, y: 0, width: 0, height: 0 };
    this.paddle4 = { x: 0, y: 0, width: 0, height: 0 };
    this.score = {
      player1: 0,
      player2: 0,
    };
    this.gameStatus = "waiting";
  }
}
let game1 = new GameState();


// Enable CORS so the client (Vite dev server) can call this API
fastify.register(require('@fastify/cors'), {
  origin: true
});

fastify.get('/', async (request, reply) => {
  return { message: 'Hello from Fastify!' };
});

// POST /up - accepts JSON { count: number } and returns { count: number }
fastify.post('/up', async (request, reply) => {
  const { count } = request.body || {};
  const n = Number(count) || 1;
  const result = n * 10;
  console.log(`Received count: ${n}, responding with: ${result}`);
  return { count: result };
});

// POST /down - accepts JSON { count: number } and returns { count: number }
fastify.post('/down', async (request, reply) => {
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
