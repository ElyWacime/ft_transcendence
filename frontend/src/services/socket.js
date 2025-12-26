let socket = null;

export function connectSocket(token) {
  if (!socket) {
    socket = new WebSocket(`ws://${import.meta.env.VITE_DOMAIN}:3000/ws?token=${token}`);
  }
  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  socket?.close();
  socket = null;
}
