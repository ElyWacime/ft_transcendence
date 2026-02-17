import Fastify from 'fastify';
import cookie from "@fastify/cookie"
import cors from "@fastify/cors"
import { Server } from 'socket.io';
import { initializeDb, saveMessage, getChatHistory, insertUsers, getUsers, checkIfConvExist, createNewConversation, getConversationsForUser, getConversationParticipantIds, blockUser, getBlockingStatus, unblockUser, getUserByUsername } from './sqlite_chat_logic.js';

const fastify = Fastify();

const allowAllOrigins = (origin, cb) => cb(null, true);

await fastify.register(cookie);
await fastify.register(cors, {
  origin: allowAllOrigins,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization", "Cookie"],
  credentials: true
});

const io = new Server(fastify.server, {
  cors: {
    origin: (requestOrigin, callback) => callback(null, true),
    methods: ["GET", "POST"], 
    credentials: true 
  }
});

async function desToken(request)
{
   const res = await fetch('http://auth-service:8000/validate_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: request.cookies.access_token }),
  });
  return res;
}

fastify.get("/getCookieValue", async (request) => {
    const res =  await desToken(request);
    const token = await res.json();
    return token;
})  

fastify.post("/conversation/start", async (request) => { 
  const res = await desToken(request);  

  const token = await res.json();
  const senderId = token.user_id;
  const receipentId = request.body.receipentId;

  let conv = await checkIfConvExist(senderId, receipentId);
  if (conv)
  {
    return { conversationId: conv.id };
  }

  conv = await createNewConversation(senderId, receipentId);
  return { conversationId: conv.id };
})

fastify.get("/conversations", async (request) => {
    const res = await desToken(request);
    const token = await res.json();
    const senderId = token.user_id;

    const userId = senderId;   
    const conv = await getConversationsForUser(userId);

    return conv;
})

fastify.get("/conversations/:id/messages", async (request) => {
  const conversationId = request.params.id;

  const messages = await getChatHistory(conversationId);

  if (messages.length === 0) {
    return [];
  }
  return messages;
})

fastify.post("/getUser", async (request, reply) => {
    const res = await desToken(request);
    const token = await res.json();

    const currentUsername = token.user_name;
    const searchUsername = request.body.username;

    const user = await getUserByUsername(searchUsername);

    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    if (user.username === currentUsername) {
      return {
        isSelf: true,
        message: 'This is your own account'
      };
    }

    return {
      isSelf: false,
      username: user.username,
      userId: user.id
    };
});

fastify.post("/addUsers", async (request) => {
  return await insertUsers(request.body.id, request.body.username);
})

fastify.post("/block", async (request) => {
  const res = await desToken(request);
  const token = await res.json();
  const blockerId = token.user_id;
  const blockedId = request.body.user_id;

  await blockUser(blockerId, blockedId);
  const status = await getBlockingStatus(blockerId, blockedId);

  return {
    blocked: status.blocked,
    blockerId: status.blockerId,
    blockedId: status.blockedId,
    message: 'User blocked successfully'
  };
});

fastify.post("/unblock", async (request, reply) => {
  const res = await desToken(request);
  const token = await res.json();
  const blockerId = token.user_id;
  const unblockedId = request.body.user_id;

  const statusBefore = await getBlockingStatus(blockerId, unblockedId);
  
  if (!statusBefore.blocked || statusBefore.blockerId !== blockerId) {
    return reply.code(400).send({ error: 'You can only unblock users you blocked' });
  }

  await unblockUser(blockerId, unblockedId);

  return {
    unblocked: true,
    unblockedId,
    message: 'User unblocked successfully'
  };
});

fastify.post("/block/status", async (request, reply) => {
  const res = await desToken(request);

  const token = await res.json();
  const requesterId = token.user_id;
  const otherUserId = request.body.user_id;

  const status = await getBlockingStatus(requesterId, otherUserId);

  if (!status.blocked) {
    return { blocked: false };
  }

  const blockedBy = status.blockerId === requesterId ? 'you' : 'other';
  const message = blockedBy === 'you' ? 'You blocked the other user' : 'The other user blocked you';

  return {
    blocked: true,
    blockedBy,
    blockerId: status.blockerId,
    blockedId: status.blockedId,
    message
  };
});

io.on('connection', (socket) => {
  let myId;
  
  socket.on('authenticate', (userId) => {
    myId = userId;
    socket.join(`user:${myId}`);
  });

  socket.on("newConversation", ({ userId }) => {
    socket.to(`user:${userId}`).emit("newConversation", {});
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { conversationId, content } = data;

      const message = await saveMessage(conversationId, myId, content.trim());

      const participantIds = await getConversationParticipantIds(conversationId);
      participantIds.forEach((pid) => {
        socket.to(`user:${pid}`).emit('receiveMessage', message);
        if (pid === myId) {
          socket.emit('receiveMessage', message);
        }
      });

    } catch (error) {
      fastify.log.error(error, 'Error saving message');
    }
  });

  socket.on('blockStatusChanged', async (data) => {
    try {
      const { otherUserId, conversationId, blockedBy } = data;

      socket.to(`user:${otherUserId}`).emit('blockStatusChanged', {
        conversationId,
        blockedBy
      });

    } catch (error) {
      fastify.log.error(error, 'Error handling block status change');
    }
  });

  socket.on('gameInvite', ({ conversationId, toUserId, fromUserId }) => {
    socket.to(`user:${toUserId}`).emit('gameInvite', {
      conversationId,
      fromUserId,
    });
  });

  socket.on('cancelInvite', ({ toUserId  }) => {
    socket.to(`user:${toUserId}`).emit('cancelInvite', {});
  });

  socket.on('gameInviteResponse', ({ conversationId, toUserId, fromUserId, accepted }) => {
    socket.to(`user:${toUserId}`).emit('gameInviteResponse', {
      conversationId,
      accepted,
      fromUserId
    });
  });
});

const start = async () => {
  try {
    await initializeDb(); 
    await fastify.listen({ port: 3700, host: '0.0.0.0' });
    fastify.log.info(`Server listening on port 3700`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();