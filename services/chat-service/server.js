import Fastify from 'fastify';
import cookie from "@fastify/cookie"
import cors from "@fastify/cors"
import { Server } from 'socket.io';
import { initializeDb, saveMessage, getChatHistory, insertUsers, getUsers, checkIfConvExist, createNewConversation, getConversationsForUser, getConversationParticipantIds, blockUser, getBlockingStatus, unblockUser, getUserByUsername } from './sqlite_chat_logic.js';


const fastify = Fastify({
});

// TEMP: Allow every origin for debugging; tighten later.
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


fastify.post("/conversation/start", async (request, reply) => { 
  const res = await fetch('http://auth-service:8000/validate_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: request.cookies.access_token }),
  });

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

fastify.get("/conversations", async (request, reply) => {
    const res = await fetch('http://auth-service:8000/validate_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: request.cookies.access_token }),
    });

    const token = await res.json();
    const senderId = token.user_id;

    const userId = senderId;   
    const conv = await getConversationsForUser(userId);

    return conv;
})

fastify.post("/getUser", async (request, reply) => {
    const res = await fetch('http://auth-service:8000/validate_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: request.cookies.access_token }),
    });

    const token = await res.json();
    const currentUserId = token.user_id;
    const currentUsername = token.user_name;
    const searchUsername = request.body?.username;

    if (!searchUsername) {
      return reply.code(400).send({ error: 'username is required in body' });
    }

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


fastify.get("/getCookieValue", async (request, reply) => {
    const accessToken = request.cookies.access_token;
    
    if (!accessToken) {
      return reply.code(400).send({ error: 'No access token found in cookies' });
    }

    const res = await fetch('http://auth-service:8000/validate_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: accessToken }),
    });

    const token = await res.json();
    return token;
})  

fastify.get("/conversations/:id/messages", async (request, reply) => {
  const conversationId = request.params.id;
  const userId = request.cookies.user_id;


  const messages = await getChatHistory(conversationId);

  if (messages.length === 0) {
    return [];
  }
  return messages;
})

fastify.post("/addUsers", async (request, reply) => {
  console.log("entered");
  console.log('Adding users:', request.body);

  await insertUsers(request.body.id, request.body.username);
  return await getUsers(request.body.id);
})

fastify.post("/block", async (request, reply) => {
  const res = await fetch('http://auth-service:8000/validate_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: request.cookies.access_token }),
  });

  const token = await res.json();
  const blockerId = token.user_id;
  const blockedId = request.body?.user_id;

  console.log({blockerId, blockedId});

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
  const res = await fetch('http://auth-service:8000/validate_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: request.cookies.access_token }),
  });

  const token = await res.json();
  const blockerId = token.user_id;
  const unblockedId = request.body?.user_id;

  console.log({blockerId, unblockedId});


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
  const res = await fetch('http://auth-service:8000/validate_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: request.cookies.access_token }),
  });

  const token = await res.json();
  const requesterId = token.user_id;
  const otherUserId = request.body?.user_id;

  if (!otherUserId) {
    return reply.code(400).send({ error: 'userId is required in body' });
  }

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

  socket.on('sendMessage', async (data) => {
    try {
      const { conversationId, content } = data;

      if (!myId) {
        socket.emit('messageError', { error: 'Not authenticated' });
        return;
      }

      if (!conversationId || !content?.trim()) {
        socket.emit('messageError', { error: 'conversationId and content are required' });
        return;
      }

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
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  socket.on('blockStatusChanged', async (data) => {
    try {
      const { otherUserId, conversationId, blockedBy } = data;

      if (!myId) {
        socket.emit('blockError', { error: 'Not authenticated' });
        return;
      }

      socket.to(`user:${otherUserId}`).emit('blockStatusChanged', {
        conversationId,
        blockedBy
      });

    } catch (error) {
      fastify.log.error(error, 'Error handling block status change');
      socket.emit('blockError', { error: 'Failed to update block status' });
    }
  });

  socket.on('gameInvite', ({ conversationId, toUserId, fromUserId, fromUsername }) => {
    if (!myId) return;
    socket.to(`user:${toUserId}`).emit('gameInvite', {
      conversationId,
      fromUserId,
      fromUsername,
    });
  });

  socket.on('gameInviteResponse', ({ conversationId, toUserId, accepted }) => {
    if (!myId) return;
    socket.to(`user:${toUserId}`).emit('gameInviteResponse', {
      conversationId,
      accepted,
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