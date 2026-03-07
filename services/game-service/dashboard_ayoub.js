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

      if (!identifier) {
        return reply.code(400).send({ error: 'Missing identifier.' });
      }

      const authServiceBaseUrl = process.env.AUTH_SERVICE_URL.replace(/\/+$/, '');
      console.log('Dashboard request for identifier:', identifier);
      let userId = identifier;

      const searchResponse = await fetch(`${authServiceBaseUrl}/search-this-name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: identifier })
      });

      if (searchResponse.ok) {
        const searchResult = await searchResponse.json();
        userId = searchResult.user_id;
      }

      // Fetch full user info using resolved user ID
      const authResponse = await fetch(`${authServiceBaseUrl}/user-info/${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!authResponse.ok) {
        return reply.code(404).send({ error: 'User not found.' });
      }
      const authUser = await authResponse.json();

      const matchesCount = await dbcnx.db.get(`SELECT count(*) as Played FROM Match 
        Where (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?);`, [authUser.id, authUser.id, authUser.id, authUser.id]);
      const winsCount = await dbcnx.UserCountWins_ayoub(authUser.id);
      const tournParticipation = await dbcnx.UserCountTournParticipation_ayoub(authUser.id);
      const lastMatch = await dbcnx.getLasttMatchByPlayerID_ayoub(authUser.id);
      const totalMatches = matchesCount?.Played || 0;
      const totalWins = winsCount?.Winned || 0;
      const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : 0;
      return {
        user: {
          id: authUser.id,
          email: authUser.email,
          User_name: authUser.name,
          avatar: authUser.avatar,
          isOnline: authUser.loggedIn,
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
