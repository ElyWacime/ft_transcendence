export async function registerDashboardRoutes_ayoub(fastify, dbcnx) {

  fastify.get('/api/dashboard/:identifier', async (request, reply) => {
    try {
      let accessToken = request.cookies.refresh_token;
      console.log("refresh_token  >> ", accessToken);
      if (!accessToken && request.headers.authorization) {
        accessToken = request.headers.authorization.split(" ")[1];
        console.log("accessToken 2>> ", accessToken);
      }
  
      if (!accessToken)
        return reply.code(403).send({ message: "Not logged in" });
  
      const decoded = request.jwt.verify(accessToken);
      if (!decoded)
        return reply.code(401).send({ message: "Couldn't decode token" });

      // const authServiceBaseUrl = process.env.AUTH_SERVICE_URL.replace(/\/+$/, '');
      // console.log('Dashboard request for identifier:', identifier);
      // let userId = identifier;

      // const searchResponse = await fetch(`${authServiceBaseUrl}/search-this-name`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({ name: identifier })
      // });

      // if (searchResponse.ok) {
      //   const searchResult = await searchResponse.json();
      //   userId = searchResult.user_id;
      // }

      // // Fetch full user info using resolved user ID
      // const authResponse = await fetch(`${authServiceBaseUrl}/user-info/${encodeURIComponent(userId)}`, {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      // if (!authResponse.ok) {
      //   return reply.code(404).send({ error: 'User not found.' });
      // }
      // const authUser = await authResponse.json();

      const matchesCount = await dbcnx.db.get(`SELECT count(*) as Played FROM Match 
        Where (P1_Id = ? OR P2_Id = ? OR P3_Id = ? OR P4_Id = ?);`, [decoded.id, decoded.id, decoded.id, decoded.id]);
      const winsCount = await dbcnx.UserCountWins_ayoub(decoded.id);
      const tournParticipation = await dbcnx.UserCountTournParticipation_ayoub(decoded.id);
      const lastMatch = await dbcnx.getLasttMatchByPlayerID_ayoub(decoded.id);
      const totalMatches = matchesCount?.Played || 0;
      const totalWins = winsCount?.Winned || 0;
      const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : 0;
      return {
        user: {
          id: null,
          email: null,
          User_name: null,
          avatar: null,
          isOnline: null,
          Auto_Match: null,
          CreatedAt: null,
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