import { Users } from "./DBController.js";

export async function registerDashboardRoutes_ayoub(fastify, dbcnx) {

  fastify.get('/api/dashboard/:identifier', async (request, reply) => {
    try {
      const { identifier } = request.params;
      
      let user = await dbcnx.getUserByName(identifier);
      if (!user) {
        user = await dbcnx.getUserById(identifier);
      }
      const id = user?.id || identifier;
      
      if (!user) {
        const authHeader = request.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        if (!token) {
          return reply.code(404).send({ error: 'User not found.' });
        }

        let decoded;
        try {
          decoded = fastify.jwt.verify(token);
        } catch (verifyError) {
          return reply.code(404).send({ error: 'User not found.' });
        }

        const matchesId = decoded.id === identifier;
        const matchesUsername = decoded.name === identifier;
        const isOwnDashboard = matchesId || matchesUsername;

        if (isOwnDashboard) {
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
            return reply.code(500).send({ error: 'Internal server error' });
          }
        } else {
          try {
            const authServiceUrl = process.env.AUTH_SERVICE_URL || 'https://auth-service:8000';
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
              return reply.code(404).send({ error: 'User not found.' });
            }

            const authUser = await authResponse.json();
            
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
            return reply.code(404).send({ error: 'User not found.' });
          }
        }
      }

      const userId = user.id;
      const matchesCount = await dbcnx.db.get(`SELECT count(*) as Played FROM Match 
        Where (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?);`, [userId, userId, userId, userId]);
      const winsCount = await dbcnx.UserCountWins_ayoub(userId);
      const tournParticipation = await dbcnx.UserCountTournParticipation_ayoub(userId);
      const lastMatch = await dbcnx.getLasttMatchByPlayerID_ayoub(userId);

      const totalMatches = matchesCount?.Played || 0;
      const totalWins = winsCount?.Winned || 0;
      const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : 0;

      let latestAvatar = user.avatar;
      try {
        const authHeader = request.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
        
        if (token) {
          const authServiceUrl = process.env.AUTH_SERVICE_URL || 'https://auth-service:8000';
          const userInfoUrl = `${authServiceUrl}/user-info/${userId}`;
          
          const authResponse = await fetch(userInfoUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (authResponse.ok) {
            const authUser = await authResponse.json();
            if (authUser.avatar) {
              latestAvatar = authUser.avatar;
              console.log("Fetched latest avatar from auth-service for user:", userId);
              console.log("Latest avatar URL:", latestAvatar);
              if (user.avatar !== latestAvatar) {
                await dbcnx.db.run(`UPDATE Users SET avatar = ? WHERE id = ?`, [latestAvatar, userId]);
              }
            }
          }
        }
      } catch (avatarError) {
        console.log("Could not fetch latest avatar from auth-service:", avatarError.message);
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          User_name: user.User_name,
          avatar: latestAvatar,
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

