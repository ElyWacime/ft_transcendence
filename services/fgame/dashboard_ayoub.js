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
      
      // If user doesn't exist in fgame database, try to get from JWT and create
      if (!user) {
        console.log("User not in fgame database, checking JWT token...");
        console.log("User not found in database, attempting to create from JWT token. ID:", id);
        // Try to get user info from JWT token in Authorization header
        const authHeader = request.headers.authorization;
        console.log("Authorization header present:", !!authHeader);
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
          try {
            const token = authHeader.substring(7);
            console.log("Token received, length:", token.length);
            console.log("Verifying JWT token...");
            let decoded;
            try {
              decoded = fastify.jwt.verify(token);
            } catch (verifyError) {
              console.error("JWT verification failed:", verifyError.message);
              // Try with jsonwebtoken directly as fallback
              const jwt = await import('jsonwebtoken');
              decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'supersecretkey');
              console.log("JWT verified with jsonwebtoken fallback");
            }
            console.log("JWT decoded successfully:", { id: decoded.id, email: decoded.email, name: decoded.name });
            
            // Create user in SQLite database
            let newUser = new Users();
            newUser.id = decoded.id || id;
            newUser.email = decoded.email || '';
            newUser.User_name = decoded.name || decoded.email || 'User';
            newUser.User_password = ''; // Set empty password (not used for dashboard)
            newUser.isOnline = true;
            newUser.Auto_Match = true;
            newUser.loggedIn = true;
            
            console.log("Creating user with data:", { id: newUser.id, email: newUser.email, name: newUser.User_name });
            
            // Try to create user in fgame database
            try {
              const result = await dbcnx.createUsers(newUser);
              console.log("createUsers result:", result);
              user = await dbcnx.getUserById(id);
              console.log("User after creation:", user ? "Found" : "Still not found");
              
              if (!user) {
                // Try querying directly to see what happened
                const checkUser = await dbcnx.db.get(`SELECT * FROM Users WHERE id = ?`, [id]);
                console.log("Direct query result:", checkUser);
                
                if (!checkUser) {
                  console.error("User creation failed - user still not found after createUsers call");
                  // Return user info from JWT anyway, even if not in database
                  user = {
                    id: newUser.id,
                    email: newUser.email,
                    User_name: newUser.User_name,
                    avatar: 'https://www.gravatar.com/avatar/',
                    isOnline: true,
                    Auto_Match: true,
                    CreatedAt: new Date().toISOString()
                  };
                  console.log("Using JWT user data as fallback");
                } else {
                  user = checkUser;
                }
              }
            } catch (createError) {
              console.error("Error creating user:", createError);
              // Use JWT data as fallback
              user = {
                id: newUser.id,
                email: newUser.email,
                User_name: newUser.User_name,
                avatar: 'https://www.gravatar.com/avatar/',
                isOnline: true,
                Auto_Match: true,
                CreatedAt: new Date().toISOString()
              };
              console.log("Using JWT user data due to creation error");
            }
          } catch (jwtError) {
            console.error("JWT decode error:", jwtError);
            // If JWT decode fails, return 404
            return reply.code(404).send({ error: 'User not found. Please log in or play a game first to create your profile.' });
          }
        } else {
          console.log("No Authorization header or not Bearer token");
          // No token provided, return 404
          return reply.code(404).send({ error: 'User not found. Please log in or play a game first to create your profile.' });
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

