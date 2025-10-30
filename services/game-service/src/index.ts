import http from 'http';
import { Server } from 'socket.io';
import { GameRoom } from './game';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET','POST']
  }
});

const rooms: Map<string, GameRoom> = new Map();

function getOrCreateRoom(roomId: string) {
  let r = rooms.get(roomId);
  if (!r) {
    r = new GameRoom(roomId);
    rooms.set(roomId, r);
  }
  return r;
}

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('join', (data: { roomId?: string }) => {
    const roomId = data?.roomId || `room_${Math.random().toString(36).slice(2,8)}`;
    const room = getOrCreateRoom(roomId);
    const assigned = room.addPlayer(socket);
    console.log(`socket ${socket.id} joined ${roomId} as ${assigned}`);
    // send the roomId back so client can store it
    socket.emit('joined', { playerId: assigned, roomId });
  });

  socket.on('input', (data: { up: boolean; down: boolean }) => {
    const roomId = socket.data.roomId as string | undefined;
    const playerId = socket.data.playerId as number | undefined;
    if (!roomId || playerId === undefined) return;
    const room = rooms.get(roomId);
    if (!room) return;
    room.handleInput(playerId, { up: !!data.up, down: !!data.down });
  });

  socket.on('disconnect', (reason) => {
    console.log('socket disconnected', socket.id, reason);
    const roomId = socket.data.roomId as string | undefined;
    if (roomId) {
      const room = rooms.get(roomId);
      if (room) {
        room.removePlayer(socket);
        if (room.playerCount() === 0) {
          rooms.delete(roomId);
          console.log('deleted empty room', roomId);
        }
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Game service listening on ${PORT}`);
});
