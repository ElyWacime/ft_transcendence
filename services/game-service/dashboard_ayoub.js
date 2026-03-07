export async function registerDashboardRoutes_ayoub(fastify, dbcnx) {

  fastify.get('/api/dashboard/:identifier', async (request, reply) => {
    try {
      const { identifier } = request.params;
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

      const userId = authUser.id;
      const matchesCount = await dbcnx.db.get(`SELECT count(*) as Played FROM Match 
        Where (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?);`, [userId, userId, userId, userId]);
      const winsCount = await dbcnx.UserCountWins_ayoub(userId);
      const tournParticipation = await dbcnx.UserCountTournParticipation_ayoub(userId);
      const lastMatch = await dbcnx.getLasttMatchByPlayerID_ayoub(userId);

      const totalMatches = matchesCount?.Played || 0;
      const totalWins = winsCount?.Winned || 0;
      const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : 0;

      let latestAvatar = authUser.avatar;
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
            }
          }
        }
      } catch (avatarError) {
        console.log("Could not fetch latest avatar from auth-service:", avatarError.message);
      }

      return {
        user: {
          id: authUser.id,
          email: authUser.email,
          User_name: authUser.User_name,
          avatar: latestAvatar,
          isOnline: authUser.isOnline,
          Auto_Match: authUser.Auto_Match,
          CreatedAt: authUser.CreatedAt
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
