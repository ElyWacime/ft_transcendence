import { TournamentService } from "./TournamentService.js";
import { Users } from "./DBController.js";

export async function registerTournamentRoutes(fastify, db) {
  const service = new TournamentService(db);

  fastify.post('/api/tournaments', async (req, reply) => {
    try {
      const { label, maxPlayers } = req.body || {};
      const id = await service.create(label, maxPlayers);
      return reply.code(201).send({ id });
    } catch (e) {
      return reply.code(400).send({ error: e.message });
    }
  });

  fastify.post('/api/tournaments/:id/join', async (req, reply) => {
    try {
      const { id } = req.params;
      // Ensure user exists in local DB (using JWT if present)
      let userId;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
          const token = req.headers.authorization.substring(7);
          const decoded = fastify.jwt.verify(token);
          userId = decoded.id;
          const u = new Users();
          u.id = decoded.id;
          u.email = decoded.email || '';
          u.User_name = decoded.name || decoded.email || 'User';
          u.isOnline = true;
          u.Auto_Match = true;
          u.loggedIn = true;
          await db.createUsers(u);
        } catch {}
      }
      userId = userId || (req.body?.userId);
      if (!userId) return reply.code(400).send({ error: 'userId required' });

      const res = await service.join(Number(id), userId);
      return reply.code(200).send(res);
    } catch (e) {
      return reply.code(400).send({ error: e.message });
    }
  });

  fastify.post('/api/tournaments/:id/start', async (req, reply) => {
    try {
      const { id } = req.params;
      const res = await service.start(Number(id));
      return reply.code(200).send(res);
    } catch (e) {
      return reply.code(400).send({ error: e.message });
    }
  });

  fastify.get('/api/tournaments/:id', async (req, reply) => {
    try {
      const { id } = req.params;
      const status = await service.getStatus(Number(id));
      return reply.code(200).send(status);
    } catch (e) {
      return reply.code(404).send({ error: e.message });
    }
  });

  fastify.post('/api/tournaments/:id/match/:matchId/ready', async (req, reply) => {
    try {
      const { id, matchId } = req.params;
      let userId;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
          const token = req.headers.authorization.substring(7);
          const decoded = fastify.jwt.verify(token);
          userId = decoded.id;
        } catch {}
      }
      userId = userId || (req.body?.userId);
      if (!userId) return reply.code(400).send({ error: 'userId required' });

      const res = await service.setPlayerReady(Number(id), Number(matchId), userId);
      return reply.code(200).send(res);
    } catch (e) {
      return reply.code(400).send({ error: e.message });
    }
  });
}
