import Fastify from 'fastify';
import cookie from "@fastify/cookie"
import cors from "@fastify/cors"
import { Server } from 'socket.io';
import initializeDb from './setup-db.js';
import { getInvitationStatus, createInvitation, cancelInvitation } from './dbAccess/invitation-q.js';
import { getBlockingStatus, blockUser, unblockUser } from './dbAccess/block-q.js';
import { getFriendStatus, addFriend, deleteFriend, getAllFriends } from './dbAccess/friends-q.js';
import { insertUsers, getUserByUsername, updateUsername } from './dbAccess/user-q.js';
import { getConversationsForUser, checkIfConvExist, createNewConversation, getChatHistory, saveMessage, getConversationParticipantIds } from './dbAccess/conversations-q.js';

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

const connectedUsers = new Map();

async function desToken(request)
{
   const res = await fetch('http://auth-service:8000/validate_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: request.cookies.access_token }),
  });
  return res;
}

fastify.get("/getCookieValue", async (request, reply) => {
    const res =  await desToken(request);
    
    if (res.status === 401) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    
    const token = await res.json();
    return token;
})

fastify.post("/users/add", async (request) => {
  return await insertUsers(request.body.id, request.body.username);
})

fastify.post("/user", async (request, reply) => {
    const res = await desToken(request);
    
    if (res.status === 401) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    
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

fastify.post("/user/update", async (request, reply) => {
  const res = await desToken(request);
  
  if (res.status === 401) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  
  const userId = request.body.user_id;
  const newUsername = request.body.username;
  const updatedUser = await updateUsername(userId, newUsername);

  return {
    message: 'Username updated successfully',
    username: updatedUser.username
  };
});


fastify.get("/conversations", async (request, reply) => {
    const res = await desToken(request);
    
    if (res.status === 401) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
    
    const token = await res.json();
    const senderId = token.user_id;

    const userId = senderId;   
    const conv = await getConversationsForUser(userId);

    return conv;
})

fastify.post("/conversations/start", async (request, reply) => { 
  const res = await desToken(request);  
  
  if (res.status === 401) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

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

fastify.get("/conversations/:id/messages", async (request) => {
  const conversationId = request.params.id;

  const messages = await getChatHistory(conversationId);

  if (messages.length === 0) {
    return [];
  }
  return messages;
})

fastify.post("/friends/status", async (request, reply) => {
  const res = await desToken(request);
  
  if (res.status === 401) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  
  const token = await res.json();
  const requesterId = token.user_id;
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

fastify.post("/friends/add", async (request, reply) => {
  const res = await desToken(request);
  
  if (res.status === 401) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  
  const token = await res.json();
  const user_a = token.user_id;
  const user_b = request.body.user_id;
  
  await addFriend(user_a, user_b);
  
  
  return {
    message: 'Friend added successfully'
  };
})

fastify.post("/friends/remove", async (request, reply) => {
  const res = await desToken(request);
  
  if (res.status === 401) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  
  const token = await res.json();
  const user_a = token.user_id;
  const user_b = request.body.user_id;
  
  await deleteFriend(user_a, user_b);
  
  return {
    message: 'Friend removed successfully'
  };
})

fastify.post("/block/status", async (request, reply) => {
  const res = await desToken(request);
  
  if (res.status === 401) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

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

fastify.post("/block", async (request, reply) => {
  const res = await desToken(request);
  
  if (res.status === 401) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  
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
  
  if (res.status === 401) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  
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

fastify.post("/invitations/status", async (request, reply) => {
  const res = await desToken(request);
  
  if (res.status === 401) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  const token = await res.json();
  const requesterId = token.user_id;
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

fastify.post("/invite", async (request, reply) => {
  const res = await desToken(request);
  
  if (res.status === 401) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  
  const token = await res.json();
  const inviterId = token.user_id;
  const inviteeId = request.body.user_id;
  const invitationType = request.body.invitation_type;
  

  await createInvitation(inviterId, inviteeId, invitationType); 
  
  return {
    pending: true,
    inviterId,
    inviteeId,
    invitationType,
    message: 'invitation sent successfully'
  };
});

fastify.post("/uninvite", async (request, reply) => {        
  const res = await desToken(request);
  
  if (res.status === 401) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
  
  const token = await res.json();
  const inviterId = token.user_id;
  const inviteeId = request.body.user_id;
  const invitationType = request.body.invitation_type;

  await cancelInvitation(inviterId, inviteeId, invitationType);

  return {
    pending: false,
    inviterId,
    inviteeId,
    invitationType,
    message: 'invitation cancelled successfully'
  };
});

io.on('connection', (socket) => {
  let myId;
  
  socket.on('authenticate', async (userId) => {
    myId = userId;
    socket.join(`user:${myId}`);
    connectedUsers.set(userId, true);

    const friendIds = await getAllFriends(userId);
    
    const onlineFriends = friendIds.filter(friendId => connectedUsers.has(friendId));
  
    socket.emit('onlineFriends', { onlineFriends });

    onlineFriends.forEach(friendId => {
      socket.to(`user:${friendId}`).emit('friendOnline', { userId: myId });
    });
  });

  socket.on('disconnect', async () => {
    if (myId) {
      const friendIds = await getAllFriends(myId);
      
      friendIds.forEach(friendId => {
        if (connectedUsers.has(friendId)) {
          socket.to(`user:${friendId}`).emit('friendOffline', { userId: myId });
        }
      });
      
      connectedUsers.delete(myId);
    }
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

  socket.on('Invite', ({ conversationId, toUserId, fromUserId, invitationType }) => {
    socket.to(`user:${toUserId}`).emit('Invite', {
      conversationId,
      fromUserId,
      invitationType
    });
  });

  socket.on('cancelInvite', ({ toUserId, invitationType  }) => {
    socket.to(`user:${toUserId}`).emit('cancelInvite', { invitationType });
  });

  socket.on('InviteResponse', ({ conversationId, toUserId, invitationType, fromUserId, accepted }) => {
    socket.to(`user:${toUserId}`).emit('InviteResponse', {
      conversationId,
      accepted,
      fromUserId,
      invitationType
    });
  });

  socket.on('unfriend', ({ userId, toUnfriend }) => {
    socket.to(`user:${userId}`).emit('unfriend', {
      userId: toUnfriend
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