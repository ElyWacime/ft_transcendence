import Fastify from 'fastify';
import cookie from "@fastify/cookie"
import cors from "@fastify/cors"
import { Server } from 'socket.io';
import * as fs from 'fs';
import https from 'https';
import xss from 'xss';
import initializeDb from './setup-db.js';
import { getInvitationStatus, createInvitation, cancelInvitation } from './dbAccess/invitation-q.js';
import { getBlockingStatus, blockUser, unblockUser } from './dbAccess/block-q.js';
import { getFriendStatus, addFriend, deleteFriend, getAllFriends } from './dbAccess/friends-q.js';
import { insertUsers, updateUsername } from './dbAccess/user-q.js';
import { getConversationsForUser, checkIfConvExist, createNewConversation, getChatHistory, saveMessage, getConversationParticipantIds, isUserParticipantInConversation } from './dbAccess/conversations-q.js';
import {
  usersAddSchema,
  userUpdateSchema,
  conversationsStartSchema,
  conversationMessagesSchema,
  friendsSchema,
  blockSchema,
  invitationsSchema,
} from './schema.js';

const httpsOptions = process.env.USE_HTTPS === "true" ? {
  https: {
    key: fs.readFileSync("/app/certs/private.key"),
    cert: fs.readFileSync("/app/certs/certificate.crt"),
  }
} : {};

const fastify = Fastify(httpsOptions);

fastify.decorateRequest('authUser', null);
fastify.decorateRequest('userId', null);

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

const connectedUsers = new Map();

const httpsAgent = process.env.USE_HTTPS === "true" ? new https.Agent({
  rejectUnauthorized: false
}) : undefined;

async function desToken(request)
{
   const protocol = process.env.USE_HTTPS === "true" ? "https" : "http";
   
   let token = null;
   const authHeader = request.headers.authorization;
   
   if (authHeader && authHeader.startsWith('Bearer ')) {
     token = authHeader.substring(7); 
   } else if (request.cookies.access_token) {
     token = request.cookies.access_token; 
   }
   
   if (!token) {
     return { status: 401, json: async () => ({ error: 'No token provided' }) };
   }
   
   const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
   };
   const res = await fetch(`${protocol}://auth-service:8000/validate_token`, fetchOptions);
  return res;
}

async function validateSocketToken(token) {
  if (!token) {
    return null;
  }
  
  const protocol = process.env.USE_HTTPS === "true" ? "https" : "http";
  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  };
  
  if (httpsAgent) {
    fetchOptions.agent = httpsAgent;
  }
  
  try {
    const res = await fetch(`${protocol}://auth-service:8000/validate_token`, fetchOptions);
    
    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
    return null;
  } catch (error) {
    fastify.log.error(error, 'Error validating socket token');
    return null;
  }
}

async function requireInternalServiceKey(request, reply) {
  const rawKey = request.headers['x-internal-service-key'];
  const providedKey = Array.isArray(rawKey) ? rawKey[0] : rawKey;
  const expectedKey = process.env.INTERNAL_SERVICE_KEY;

  if (!expectedKey || !providedKey || providedKey !== expectedKey) {
    return reply.code(403).send({ error: 'Forbidden' });
  }
}

async function requireAuth(request, reply) {
  const res = await desToken(request);

  if (res.status === 429) {
    const retryAfter = res.headers.get('Retry-After');
    if (retryAfter) {
      reply.header('Retry-After', retryAfter);
    }
    const body = await res.json().catch(() => ({ error: 'Too many requests' }));
    return reply.code(429).send(body);
  }

  if (res.status !== 200) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  request.authUser = await res.json();
  request.userId = request.authUser.user_id;
}

fastify.post("/users/add", { schema: usersAddSchema, preHandler: requireInternalServiceKey }, async (request) => {
  return await insertUsers(request.body.id, request.body.username);
})

fastify.post("/user/update", { schema: userUpdateSchema, preHandler: requireAuth }, async (request) => {
  const senderId = request.userId;
  
  const newUsername = request.body.username;
  const updatedUser = await updateUsername(senderId, newUsername);

  return {
    message: 'Username updated successfully',
    username: updatedUser.username
  };
});


fastify.get("/conversations", { preHandler: requireAuth }, async (request) => {
    const userId = request.userId;
    const conv = await getConversationsForUser(userId);

    return conv;
})

fastify.post("/conversations/start", { schema: conversationsStartSchema, preHandler: requireAuth }, async (request, reply) => { 
  const senderId = request.userId;
  const receipentId = request.body.receipentId;



  if (senderId === receipentId) {
    return reply.code(400).send({ error: 'Cannot start a conversation with yourself' });
  }

  let conv = await checkIfConvExist(senderId, receipentId);
  if (conv)
  {
    return { conversationId: conv.id };
  }

  conv = await createNewConversation(senderId, receipentId);
  return { conversationId: conv.id };
})

fastify.get("/conversations/:id/messages", { schema: conversationMessagesSchema, preHandler: requireAuth }, async (request, reply) => {
  const userId = request.userId;

  const conversationId = request.params.id;

  const isParticipant = await isUserParticipantInConversation(conversationId, userId);
  if (!isParticipant) {
    return reply.code(403).send({ error: 'Forbidden: you are not a participant in this conversation' });
  }

  const messages = await getChatHistory(conversationId);

  if (messages.length === 0) {
    return [];
  }
  return messages;
})

fastify.post("/friends/status", { schema: friendsSchema, preHandler: requireAuth }, async (request) => {
  const requesterId = request.userId;
  const otherUserId = request.body.user_id;
  
  const status = await getFriendStatus(requesterId, otherUserId);

  if (!status.friends) {
    return { friends: false };
  }

  return {
    friends: true,
    message: 'You are friends with this user'
  };
});

fastify.get("/friends", { preHandler: requireAuth }, async (request) => {
  const userId = request.userId;
  
  const friends = await getAllFriends(userId);
  
  return { friends };
});

fastify.post("/friends/add", { schema: friendsSchema, preHandler: requireAuth }, async (request, reply) => {
  const user_a = request.userId;
  const user_b = request.body.user_id;
  
  if (user_a === user_b) {
    return reply.code(400).send({ error: 'Cannot add yourself as a friend' });
  }

  await addFriend(user_a, user_b);
  
  return {
    message: 'Friend added successfully'
  };
})

fastify.post("/friends/remove", { schema: friendsSchema, preHandler: requireAuth }, async (request) => {
  const user_a = request.userId;
  const user_b = request.body.user_id;
  
  await deleteFriend(user_a, user_b);
  
  return {
    message: 'Friend removed successfully'
  };
})

fastify.post("/block/status", { schema: blockSchema, preHandler: requireAuth }, async (request) => {
  const requesterId = request.userId;
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

fastify.post("/block", { schema: blockSchema, preHandler: requireAuth }, async (request) => {
  const blockerId = request.userId;
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

fastify.post("/unblock", { schema: blockSchema, preHandler: requireAuth }, async (request, reply) => {
  const blockerId = request.userId;
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

fastify.post("/invitations/status", { schema: invitationsSchema, preHandler: requireAuth }, async (request) => {
  const requesterId = request.userId;
  const otherUserId = request.body.user_id;
  const invitationType = request.body.invitationType;


  const status = await getInvitationStatus(requesterId, otherUserId, invitationType);

  if (!status.pending) {
    return { pending: false };
  }

  const invitedBy = status.inviterId === requesterId ? 'you' : 'other';

  return {
      pending: true,
      invitedBy,
      inviterId: status.inviterId,
      inviteeId: status.inviteeId,
      invitationType: status.invitationType,
    };
});

fastify.post("/invite", { schema: invitationsSchema, preHandler: requireAuth }, async (request) => {
  const inviterId = request.userId;
  const inviteeId = request.body.user_id;
  const invitationType = request.body.invitationType;
  

  await createInvitation(inviterId, inviteeId, invitationType); 
  
  return {
    pending: true,
    inviterId,
    inviteeId,
    invitationType,
    message: 'invitation sent successfully'
  };
});

fastify.post("/uninvite", { schema: invitationsSchema, preHandler: requireAuth }, async (request) => {        
  const inviterId = request.userId;
  const inviteeId = request.body.user_id;
  const invitationType = request.body.invitationType;

  await cancelInvitation(inviterId, inviteeId, invitationType);

  return {
    pending: false,
    inviterId,
    inviteeId,
    invitationType,
    message: 'invitation cancelled successfully'
  };
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('No access token provided'));
    }

    const userData = await validateSocketToken(token);    
    if (!userData) {
      return next(new Error('Invalid or expired token'));
    }

    socket.userId = userData.user_id;

    fastify.log.info(`Socket authenticated for user: ${socket.userId}`);
    next();
  } catch (error) {
    fastify.log.error(error, 'Socket authentication error');
    next(new Error('Authentication failed'));
  }
});

io.on('connection', async (socket) => {
  const myId = socket.userId;

  socket.emit('authenticate', { userId: myId });
    
  socket.join(`user:${myId}`);
  
  connectedUsers.set(myId, true);

  const friendIds = await getAllFriends(myId);
  const onlineFriends = friendIds.filter(friendId => connectedUsers.has(friendId));

  socket.emit('onlineFriends', { onlineFriends });

  onlineFriends.forEach(friendId => {
    socket.to(`user:${friendId}`).emit('friendOnline', { userId: myId });
  });

  socket.on('disconnect', async () => {
    const friendIds = await getAllFriends(myId);
    
    friendIds.forEach(friendId => {
      if (connectedUsers.has(friendId)) {
        socket.to(`user:${friendId}`).emit('friendOffline', { userId: myId });
      }
    });
    
    connectedUsers.delete(myId);    
  });  

  socket.on('AddFriendOnline', ({ userId }) => {
    if (connectedUsers.has(userId)) {
        socket.emit('friendOnline', { userId });
    }

    socket.to(`user:${userId}`).emit('friendOnline', { userId: myId });
  });

  socket.on("newConversation", ({ userId }) => {
    socket.to(`user:${userId}`).emit("newConversation", {});
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { conversationId, content } = data;

      const isParticipant = await isUserParticipantInConversation(conversationId, myId);
      if (!isParticipant) {
        fastify.log.warn(`User ${myId} tried to send message to conversation ${conversationId} without being a participant`);
        return;
      }

      if (!content || content.length > 1000) {
        return;
      }

      const sanitizedContent = xss(content.trim());
      const message = await saveMessage(conversationId, myId, sanitizedContent);

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

  socket.on('Invite', ({ conversationId, toUserId, fromUserId, invitationType }) => {
    socket.to(`user:${toUserId}`).emit('Invite', {
      conversationId,
      fromUserId,
      invitationType
    });
  });

  socket.on('cancelInvite', ({ toUserId  }) => {
    socket.to(`user:${toUserId}`).emit('cancelInvite', {});
  });

  socket.on('InviteResponse', ({ conversationId, toUserId, invitationType, fromUserId, accepted }) => {
    socket.to(`user:${toUserId}`).emit('InviteResponse', {
      conversationId,
      accepted,
      fromUserId,
      invitationType
    });
  });

  socket.on('unfriend', ({ userId, toUnfriend, conversationId }) => {
    socket.to(`user:${userId}`).emit('unfriend', {
      conversationId: conversationId,
      userId: toUnfriend
    });
  });
});

const start = async () => {
  try {
    await initializeDb();
    
    const useHttps = process.env.USE_HTTPS === "true";
    const port = 3700;

    await fastify.listen({ port, host: '0.0.0.0' });

    fastify.log.info(`Server listening on port ${port} (${useHttps ? 'HTTPS' : 'HTTP'})`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();