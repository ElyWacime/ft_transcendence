import { Users } from "./DBController.js";

export async function registerDashboardRoutes_ayoub(fastify, dbcnx) {

  fastify.get('/api/dashboard/:identifier', async (request, reply) => {
    try {
      const { identifier } = request.params;
      const authHeader = request.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

      let user = await dbcnx.getUserByName(identifier);
      if (!user) {
        user = await dbcnx.getUserById(identifier);
      }

      let userId = user?.id;

      if (!userId) {
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

        if (matchesId || matchesUsername) {
          userId = decoded.id;
        } else {
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
              return reply.code(404).send({ error: 'User not found.' });
            }

            const authUser = await authResponse.json();
            userId = authUser.user_id;
          } catch (fetchError) {
            return reply.code(404).send({ error: 'User not found.' });
          }
        }
      }

      if (!user && userId) {
        user = await dbcnx.getUserById(userId);
      }

      if (!userId) {
        return reply.code(404).send({ error: 'User not found.' });
      }

      if (!user) {
        user = {
          id: userId,
          email: '',
          User_name: 'User',
          avatar: 'https://scx2.b-cdn.net/gfx/news/2019/galaxy.jpg',
          isOnline: false,
          Auto_Match: true,
          CreatedAt: new Date().toISOString()
        };
      }

      const matchesCount = await dbcnx.db.get(`SELECT count(*) as Played FROM Match 
        Where (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?);`, [userId, userId, userId, userId]);
      const winsCount = await dbcnx.UserCountWins_ayoub(userId);
      const tournParticipation = await dbcnx.UserCountTournParticipation_ayoub(userId);
      const lastMatch = await dbcnx.getLasttMatchByPlayerID_ayoub(userId);

      const totalMatches = matchesCount?.Played || 0;
      const totalWins = winsCount?.Winned || 0;
      const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : 0;

      let latestAvatar = user.avatar;
      let latestEmail = user.email;
      let latestUsername = user.User_name;
      try {
        if (token) {
          const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:8000';
          const userInfoUrl = `${authServiceUrl}/user-info/${userId}`;
          
          const authResponse = await fetch(userInfoUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (authResponse.ok) {
            const authUser = await authResponse.json();
            if (authUser.email) {
              latestEmail = authUser.email;
            }
            if (authUser.name) {
              latestUsername = authUser.name;
            }
            if (authUser.avatar) {
              latestAvatar = authUser.avatar;
              console.log("Fetched latest avatar from auth-service for user:", userId);
              console.log("Latest avatar URL:", latestAvatar);
            }

            if (
              user.avatar !== latestAvatar ||
              user.email !== latestEmail ||
              user.User_name !== latestUsername
            ) {
              await dbcnx.db.run(
                `UPDATE Users SET avatar = ?, email = ?, User_name = ? WHERE id = ?`,
                [latestAvatar, latestEmail, latestUsername, userId]
              );
            }
          }
        }
      } catch (avatarError) {
        console.log("Could not fetch latest avatar from auth-service:", avatarError.message);
      }

      return {
        user: {
          id: user.id,
          email: latestEmail,
          User_name: latestUsername,
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

