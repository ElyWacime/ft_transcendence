export async function registerDashboardRoutes_ayoub(fastify, dbcnx) {

  fastify.get('/api/dashboard/:identifier', async (request, reply) => {
    try {
      const auth = request.headers.authorization;

      if (!auth)
        return reply.code(403).send({ message: 'Not logged in' });
  
      const token = auth.split(' ')[1];
  
      const decoded = request.jwt.verify(token);
      if (!decoded)
        return reply.code(401).send({ message: "Couldn't decode token" });

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
      return {
        user: {
          id: authUser.id,
          email: authUser.email,
          User_name: authUser.User_name,
          avatar: authUser.avatar,
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
