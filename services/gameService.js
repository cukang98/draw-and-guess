import { emitWhenConnected, connectSocket } from '@/lib/socket';

const gameService = {
  createRoom: (username, avatar) => new Promise((resolve, reject) => {
    emitWhenConnected('create-room', { username, avatar }, (res) => {
      if (res.success) resolve(res.room);
      else reject(new Error(res.error || 'Failed to create room'));
    });
  }),

  joinRoom: (roomCode, username, avatar) => new Promise((resolve, reject) => {
    emitWhenConnected('join-room', { roomCode, username, avatar }, (res) => {
      if (res.success) resolve(res.room);
      else reject(new Error(res.error || 'Failed to join room'));
    });
  }),

  getRoom: (roomCode) => new Promise((resolve, reject) => {
    emitWhenConnected('get-room', { roomCode }, (res) => {
      if (res.success) resolve(res.room);
      else reject(new Error('Room not found'));
    });
  }),

  getGameState: (roomCode) => new Promise((resolve, reject) => {
    emitWhenConnected('get-game-state', { roomCode }, (res) => {
      if (res.success) resolve(res.room);
      else reject(new Error('Game state not found'));
    });
  }),

  toggleReady: () => {
    const socket = connectSocket();
    socket.emit('toggle-ready');
  },

  startGame: () => new Promise((resolve, reject) => {
    emitWhenConnected('start-game', {}, (res) => {
      if (res.success) resolve();
      else reject(new Error(res.error || 'Failed to start game'));
    });
  }),

  sendMessage: (message) => {
    const socket = connectSocket();
    socket.emit('send-message', { message });
  },

  sendDrawStroke: (strokeData) => {
    const socket = connectSocket();
    socket.emit('draw-stroke', strokeData);
  },

  clearCanvas: () => {
    const socket = connectSocket();
    socket.emit('clear-canvas');
  },
};

export default gameService;
