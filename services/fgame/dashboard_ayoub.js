// Dashboard route handler for player information
// To use this, import and call: await registerDashboardRoutes_ayoub(fastify, dbcnx);
// Make sure CORS is registered in your Fastify instance before calling this function

import { Users } from "./DBController.js";

export async function registerDashboardRoutes_ayoub(fastify, dbcnx) {
  // Dashboard endpoint to get player information and statistics
  fastify.get('/api/dashboard/:id', async (request, reply) => {
    console.log("\n\n=== DASHBOARD REQUEST RECEIVED ===");
    console.log("Timestamp:", new Date().toISOString());
    try {
      const { id } = request.params;
      console.log("User ID from params:", id);
      console.log("Authorization header:", request.headers.authorization ? "Present" : "Missing");
      
      // Get user information from fgame database
      let user = await dbcnx.getUserById(id);
      console.log("User found in fgame database:", !!user);
      
      // If user doesn't exist and the requested ID isn't the caller's ID, return 404 (do NOT create)
      // Only auto-create when the requester is loading their own dashboard and they don't exist yet.
      if (!user) {
        const authHeader = request.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        if (!token) {
          console.log("User not found and no token provided; returning 404");
          return reply.code(404).send({ error: 'User not found.' });
        }

        let decoded;
        try {
          decoded = fastify.jwt.verify(token);
        } catch (verifyError) {
          console.error("JWT verification failed while attempting auto-create:", verifyError.message);
          return reply.code(404).send({ error: 'User not found.' });
        }

        // If the requested id is NOT the same as the token owner, do not create; just 404
        if (!decoded?.id || decoded.id !== id) {
          console.log("Requested dashboard id does not match token owner; returning 404");
          return reply.code(404).send({ error: 'User not found.' });
        }

        console.log("User not in fgame database; auto-creating for self with id:", id);
        try {
          const newUser = new Users();
          newUser.id = decoded.id;
          newUser.email = decoded.email || '';
          newUser.User_name = decoded.name || decoded.email || 'User';
          newUser.User_password = '';
          newUser.isOnline = true;
          newUser.Auto_Match = true;
          newUser.loggedIn = true;

          await dbcnx.createUsers(newUser);
          user = await dbcnx.getUserById(id);

          if (!user) {
            const fallback = await dbcnx.db.get(`SELECT * FROM Users WHERE id = ?`, [id]);
            user = fallback || {
              id: newUser.id,
              email: newUser.email,
              User_name: newUser.User_name,
              avatar: 'https://www.gravatar.com/avatar/',
              isOnline: true,
              Auto_Match: true,
              CreatedAt: new Date().toISOString()
            };
          }
        } catch (createError) {
          console.error("Error creating user for self-dashboard:", createError);
          return reply.code(500).send({ error: 'Internal server error' });
        }
      }

      // Get player statistics - using db.get directly for matches count since UserCountMatches_ayoub uses db.run
      const matchesCount = await dbcnx.db.get(`SELECT count(*) as Played FROM Match 
        Where (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?);`, [id, id, id, id]);
      const winsCount = await dbcnx.UserCountWins_ayoub(id);
      const tournParticipation = await dbcnx.UserCountTournParticipation_ayoub(id);
      const lastMatch = await dbcnx.getLasttMatchByPlayerID_ayoub(id);

      // Calculate win rate
      const totalMatches = matchesCount?.Played || 0;
      const totalWins = winsCount?.Winned || 0;
      const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : 0;

      return {
        user: {
          id: user.id,
          email: user.email,
          User_name: user.User_name,
          avatar: user.avatar,
          isOnline: user.isOnline,
          Auto_Match: user.Auto_Match,
          CreatedAt: user.CreatedAt
        },
        statistics: {
          totalMatches: totalMatches,
          totalWins: totalWins,
          totalLosses: totalMatches - totalWins,
          winRate: parseFloat(winRate),
          tournamentParticipations: tournParticipation?.Participate || 0
        },
        lastMatch: lastMatch || null
      };
    } catch (error) {
      console.error('Dashboard error:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}

