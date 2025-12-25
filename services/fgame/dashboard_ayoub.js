// Dashboard route handler for player information
// To use this, import and call: await registerDashboardRoutes_ayoub(fastify, dbcnx);
// Make sure CORS is registered in your Fastify instance before calling this function

import { Users } from "./DBController.js";

export async function registerDashboardRoutes_ayoub(fastify, dbcnx) {
  // Dashboard endpoint to get player information and statistics
  // Accepts both username and ID - tries username first, then falls back to ID
  fastify.get('/api/dashboard/:identifier', async (request, reply) => {
    console.log("\n\n=== DASHBOARD REQUEST RECEIVED ===");
    console.log("Timestamp:", new Date().toISOString());
    try {
      const { identifier } = request.params;
      console.log("User identifier from params:", identifier);
      console.log("Authorization header:", request.headers.authorization ? "Present" : "Missing");
      
      // Get user information from fgame database - try username first, then ID
      let user = await dbcnx.getUserByName(identifier);
      if (!user) {
        user = await dbcnx.getUserById(identifier);
      }
      const id = user?.id || identifier;
      console.log("User found in fgame database:", !!user);
      
      // If user doesn't exist in fgame database, try to fetch from auth-service or create with zero stats
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
          console.error("JWT verification failed:", verifyError.message);
          return reply.code(404).send({ error: 'User not found.' });
        }

        // Check if viewing own dashboard or someone else's
        const matchesId = decoded.id === identifier;
        const matchesUsername = decoded.name === identifier;
        const isOwnDashboard = matchesId || matchesUsername;

        if (isOwnDashboard) {
          // Auto-create for self
          console.log("User not in fgame database; auto-creating for self with identifier:", identifier);
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
            user = await dbcnx.getUserById(decoded.id);

            if (!user) {
              const fallback = await dbcnx.db.get(`SELECT * FROM Users WHERE id = ?`, [decoded.id]);
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
        } else {
          // Viewing someone else's dashboard - try to fetch from auth-service
          console.log("Fetching user from auth-service for identifier:", identifier);
          try {
            const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:8000';
            const searchUrl = `${authServiceUrl}/api/auth/search-this-name`;
            
            const authResponse = await fetch(searchUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ name: identifier })
            });

            if (!authResponse.ok) {
              console.log("User not found in auth-service; returning 404");
              return reply.code(404).send({ error: 'User not found.' });
            }

            const authUser = await authResponse.json();
            console.log("Found user in auth-service:", authUser.user_name);
            
            // Create user in fgame database with zero stats
            const newUser = new Users();
            newUser.id = authUser.user_id;
            newUser.email = authUser.user_email || '';
            newUser.User_name = authUser.user_name || 'User';
            newUser.User_password = '';
            newUser.isOnline = false;
            newUser.Auto_Match = true;
            newUser.loggedIn = false;

            await dbcnx.createUsers(newUser);
            user = await dbcnx.getUserById(authUser.user_id);

            if (!user) {
              // Use fallback if still not found
              user = {
                id: newUser.id,
                email: newUser.email,
                User_name: newUser.User_name,
                avatar: 'https://www.gravatar.com/avatar/',
                isOnline: false,
                Auto_Match: true,
                CreatedAt: new Date().toISOString()
              };
            }
          } catch (fetchError) {
            console.error("Error fetching user from auth-service:", fetchError);
            return reply.code(404).send({ error: 'User not found.' });
          }
        }
      }

      // Get player statistics - using db.get directly for matches count since UserCountMatches_ayoub uses db.run
      const userId = user.id;
      const matchesCount = await dbcnx.db.get(`SELECT count(*) as Played FROM Match 
        Where (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?);`, [userId, userId, userId, userId]);
      const winsCount = await dbcnx.UserCountWins_ayoub(userId);
      const tournParticipation = await dbcnx.UserCountTournParticipation_ayoub(userId);
      const lastMatch = await dbcnx.getLasttMatchByPlayerID_ayoub(userId);

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

