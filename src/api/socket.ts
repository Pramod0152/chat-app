import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    // The JWT must travel as an HTTP header (backend reads handshake.headers.token).
    // Browsers can't set headers on a raw WebSocket, so the handshake must start on
    // polling to carry the header, then upgrade to websocket.
    extraHeaders: { token },
    transports: ['polling', 'websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
  }
  socket = null;
}
