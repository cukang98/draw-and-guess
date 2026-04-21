import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io({ autoConnect: false });
  }
  return socket;
};

export const connectSocket = () => {
  const sock = getSocket();
  if (!sock.connected) {
    sock.connect();
  }
  return sock;
};

export const emitWhenConnected = (event, data, callback) => {
  const sock = connectSocket();
  if (sock.connected) {
    sock.emit(event, data, callback);
  } else {
    sock.once('connect', () => sock.emit(event, data, callback));
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};
