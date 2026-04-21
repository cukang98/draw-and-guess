const {
  createRoom,
  getRoom,
  addPlayer,
  removePlayer,
  updatePlayerId,
  setPlayerReady,
  deleteRoom,
} = require('../rooms');

const WORDS = {
  en: [
    'cat', 'dog', 'house', 'tree', 'sun', 'moon', 'star', 'fish', 'bird', 'cake',
    'apple', 'book', 'car', 'chair', 'cloud', 'computer', 'door', 'elephant', 'flower',
    'guitar', 'hat', 'ice cream', 'jacket', 'kite', 'lamp', 'mountain', 'noodle',
    'ocean', 'pizza', 'rainbow', 'snake', 'telephone', 'umbrella', 'violin',
    'watermelon', 'airplane', 'balloon', 'butterfly', 'castle', 'diamond',
    'engine', 'forest', 'glasses', 'helicopter', 'island', 'jellyfish',
    'keyboard', 'lighthouse', 'mermaid', 'notebook', 'orange', 'penguin',
    'sandwich', 'tiger', 'unicorn', 'volcano', 'wallet', 'zombie', 'dragon',
    'rocket', 'crown', 'robot', 'ghost', 'treasure', 'compass', 'cactus',
  ],
  zh: [
    '猫', '狗', '房子', '树', '太阳', '月亮', '星星', '鱼', '鸟', '蛋糕',
    '苹果', '书', '汽车', '椅子', '云', '电脑', '门', '大象', '花', '吉他',
    '帽子', '冰淇淋', '风筝', '灯', '山', '面条', '海洋', '披萨', '彩虹', '蛇',
    '电话', '雨伞', '西瓜', '飞机', '气球', '蝴蝶', '城堡', '钻石',
    '森林', '眼镜', '直升机', '岛屿', '水母', '键盘', '灯塔', '美人鱼',
    '笔记本', '橙子', '企鹅', '三明治', '老虎', '独角兽', '火山', '恐龙',
    '火箭', '皇冠', '机器人', '幽灵', '宝藏', '指南针', '仙人掌',
  ],
};

const getRandomWord = (language) => {
  const list = WORDS[language] || WORDS.en;
  return list[Math.floor(Math.random() * list.length)];
};

const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// socketId -> roomCode
const playerRooms = new Map();

// sessionId -> { roomCode, playerId (old socketId), timeout }
const disconnectedPlayers = new Map();

const sanitizeRoom = (room, viewerId) => ({
  code: room.code,
  host: room.host,
  language: room.language || 'en',
  players: room.players,
  status: room.status,
  currentRound: room.currentRound,
  totalRounds: room.totalRounds,
  currentDrawer: room.currentDrawer,
  guessedPlayers: room.guessedPlayers,
  roundTimeLeft: room.roundTimeLeft,
  roundDuration: room.roundDuration,
  chatMessages: room.chatMessages,
  currentWord: viewerId && room.currentDrawer === viewerId ? room.currentWord : null,
  wordLength: room.currentWord ? room.currentWord.length : null,
});

const startRoundTimer = (io, room, code) => {
  if (room.roundTimer) clearInterval(room.roundTimer);

  room.roundTimer = setInterval(() => {
    room.roundTimeLeft -= 1;
    io.to(code).emit('timer-tick', { timeLeft: room.roundTimeLeft });

    if (room.roundTimeLeft <= 0) {
      endRound(io, room, code);
    }
  }, 1000);
};

const endGame = (io, room, code) => {
  if (room.roundTimer) {
    clearInterval(room.roundTimer);
    room.roundTimer = null;
  }

  room.status = 'ended';
  room.currentDrawer = null;
  room.currentWord = null;

  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  io.to(code).emit('game-ended', { players: sortedPlayers });

  setTimeout(() => {
    deleteRoom(code);
  }, 300000);
};

const startNextRound = (io, room, code) => {
  const totalTurns = room.drawOrder.length * room.totalRounds;
  if (room.currentRound >= totalTurns) {
    endGame(io, room, code);
    return;
  }

  const drawerIndex = room.currentRound % room.drawOrder.length;
  const drawerId = room.drawOrder[drawerIndex];
  const word = getRandomWord(room.language);

  room.currentRound += 1;
  room.currentDrawer = drawerId;
  room.currentWord = word;
  room.guessedPlayers = [];
  room.chatMessages = [];
  room.roundTimeLeft = room.roundDuration;

  io.to(code).emit('clear-canvas');

  room.players.forEach((p) => {
    const sock = io.sockets.sockets.get(p.id);
    if (!sock) return;

    sock.emit('new-round', {
      round: room.currentRound,
      totalRounds: totalTurns,
      drawerId,
      word: p.id === drawerId ? word : null,
      wordLength: word.length,
      players: room.players,
      language: room.language || 'en',
    });
  });

  startRoundTimer(io, room, code);
};

function endRound(io, room, code) {
  if (room.roundTimer) {
    clearInterval(room.roundTimer);
    room.roundTimer = null;
  }

  const currentRoom = getRoom(code);
  if (!currentRoom) return;

  io.to(code).emit('round-ended', {
    word: room.currentWord,
    players: room.players,
  });

  setTimeout(() => {
    const r = getRoom(code);
    if (!r || r.status !== 'playing') return;
    startNextRound(io, r, code);
  }, 5000);
}

const startGame = (io, room, code) => {
  room.status = 'playing';
  room.currentRound = 0;
  room.players.forEach((p) => {
    p.score = 0;
  });
  room.drawOrder = shuffleArray(room.players.map((p) => p.id));

  io.to(code).emit('game-started', { room: sanitizeRoom(room, null) });

  // Delay first round so clients can navigate to the game page
  setTimeout(() => {
    const r = getRoom(code);
    if (r && r.status === 'playing') {
      startNextRound(io, r, code);
    }
  }, 1500);
};

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('create-room', ({ username, avatar, sessionId, language }, callback) => {
      const room = createRoom(socket.id, {
        username, avatar, sessionId: sessionId || null, language: language || 'en',
      });
      socket.join(room.code);
      playerRooms.set(socket.id, room.code);
      callback({ success: true, room: sanitizeRoom(room, socket.id) });
    });

    socket.on('join-room', ({ roomCode, username, avatar, sessionId }, callback) => {
      const code = roomCode.toUpperCase().trim();
      const room = getRoom(code);

      if (!room) { callback({ success: false, error: 'Room not found' }); return; }
      if (room.status !== 'waiting') { callback({ success: false, error: 'Game already in progress' }); return; }
      if (room.players.length >= 8) { callback({ success: false, error: 'Room is full' }); return; }

      const updated = addPlayer(code, { id: socket.id, sessionId: sessionId || null, username, avatar });
      socket.join(code);
      playerRooms.set(socket.id, code);

      callback({ success: true, room: sanitizeRoom(updated, socket.id) });
      socket.to(code).emit('player-joined', {
        player: updated.players.find((p) => p.id === socket.id),
      });
      io.to(code).emit('room-updated', { room: sanitizeRoom(updated, null) });
    });

    socket.on('rejoin-room', ({ roomCode, sessionId }, callback) => {
      const code = roomCode?.toUpperCase().trim();
      if (!code) { callback({ success: false, error: 'Invalid room code' }); return; }

      // Already registered in this room (no reconnect needed)
      if (playerRooms.get(socket.id) === code) {
        const room = getRoom(code);
        if (room) { callback({ success: true, room: sanitizeRoom(room, socket.id) }); }
        else { callback({ success: false, error: 'Room not found' }); }
        return;
      }

      // Reconnecting within grace period
      const disconnected = disconnectedPlayers.get(sessionId);
      if (disconnected && disconnected.roomCode === code) {
        clearTimeout(disconnected.timeout);
        disconnectedPlayers.delete(sessionId);

        const room = getRoom(code);
        if (!room) { callback({ success: false, error: 'Room expired' }); return; }

        const updated = updatePlayerId(code, disconnected.playerId, socket.id);
        if (!updated) { callback({ success: false, error: 'Player not found in room' }); return; }

        socket.join(code);
        playerRooms.set(socket.id, code);

        io.to(code).emit('room-updated', { room: sanitizeRoom(updated, null) });
        callback({ success: true, room: sanitizeRoom(updated, socket.id) });
        return;
      }

      callback({ success: false, error: 'Session expired, please rejoin from lobby' });
    });

    socket.on('get-room', ({ roomCode }, callback) => {
      const room = getRoom(roomCode);
      if (!room) { callback({ success: false }); return; }
      callback({ success: true, room: sanitizeRoom(room, socket.id) });
    });

    socket.on('get-game-state', ({ roomCode }, callback) => {
      const room = getRoom(roomCode);
      if (!room) { callback({ success: false }); return; }
      callback({ success: true, room: sanitizeRoom(room, socket.id) });
    });

    socket.on('toggle-ready', (_, callback) => {
      const code = playerRooms.get(socket.id);
      if (!code) return;

      const room = getRoom(code);
      if (!room) return;

      const player = room.players.find((p) => p.id === socket.id);
      if (!player) return;

      const updated = setPlayerReady(code, socket.id, !player.isReady);
      io.to(code).emit('room-updated', { room: sanitizeRoom(updated, null) });
      if (callback) callback({ success: true });
    });

    socket.on('start-game', (_, callback) => {
      const code = playerRooms.get(socket.id);
      if (!code) return;

      const room = getRoom(code);
      if (!room || room.host !== socket.id) {
        if (callback) callback({ success: false, error: 'Not the host' });
        return;
      }
      if (room.players.length < 2) {
        if (callback) callback({ success: false, error: 'Need at least 2 players' });
        return;
      }

      startGame(io, room, code);
      if (callback) callback({ success: true });
    });

    socket.on('draw-stroke', (data) => {
      const code = playerRooms.get(socket.id);
      if (!code) return;

      const room = getRoom(code);
      if (!room || room.currentDrawer !== socket.id) return;

      socket.to(code).emit('draw-stroke', data);
    });

    socket.on('clear-canvas', () => {
      const code = playerRooms.get(socket.id);
      if (!code) return;

      const room = getRoom(code);
      if (!room || room.currentDrawer !== socket.id) return;

      socket.to(code).emit('clear-canvas');
    });

    socket.on('send-message', ({ message }, callback) => {
      const code = playerRooms.get(socket.id);
      if (!code) return;

      const room = getRoom(code);
      if (!room) return;

      const player = room.players.find((p) => p.id === socket.id);
      if (!player) return;
      if (room.currentDrawer === socket.id) return;
      if (room.guessedPlayers.includes(socket.id)) return;

      const trimmed = message.trim();
      const isCorrect = room.currentWord
        && trimmed.toLowerCase() === room.currentWord.toLowerCase();

      if (isCorrect) {
        room.guessedPlayers.push(socket.id);

        const timeBonus = Math.round((room.roundTimeLeft / room.roundDuration) * 80);
        const positionBonus = Math.max(0, 20 - (room.guessedPlayers.length - 1) * 5);
        const points = 50 + timeBonus + positionBonus;

        player.score += points;

        const drawer = room.players.find((p) => p.id === room.currentDrawer);
        if (drawer) drawer.score += 15;

        const chatMsg = {
          id: `${Date.now()}-${Math.random()}`,
          playerId: socket.id,
          username: player.username,
          message: `🎉 ${player.username} guessed the word!`,
          type: 'correct-guess',
          timestamp: Date.now(),
        };

        room.chatMessages.push(chatMsg);
        io.to(code).emit('correct-guess', {
          playerId: socket.id,
          username: player.username,
          points,
          players: room.players,
        });
        io.to(code).emit('new-message', chatMsg);

        const nonDrawers = room.players.filter((p) => p.id !== room.currentDrawer);
        if (room.guessedPlayers.length >= nonDrawers.length) {
          endRound(io, room, code);
        }
      } else {
        const chatMsg = {
          id: `${Date.now()}-${Math.random()}`,
          playerId: socket.id,
          username: player.username,
          message: trimmed,
          type: 'message',
          timestamp: Date.now(),
        };
        room.chatMessages.push(chatMsg);
        io.to(code).emit('new-message', chatMsg);
      }

      if (callback) callback({ success: true });
    });

    socket.on('disconnect', () => {
      const code = playerRooms.get(socket.id);
      if (!code) return;

      playerRooms.delete(socket.id);

      const room = getRoom(code);
      if (!room) return;

      const player = room.players.find((p) => p.id === socket.id);

      // Give a grace period for players with sessionId to reconnect
      if (player?.sessionId) {
        const { sessionId } = player;
        const playerId = socket.id;

        const timeout = setTimeout(() => {
          disconnectedPlayers.delete(sessionId);
          const currentRoom = getRoom(code);
          if (!currentRoom) return;
          if (!currentRoom.players.find((p) => p.id === playerId)) return;

          const wasDrawer = currentRoom.status === 'playing' && currentRoom.currentDrawer === playerId;
          const updated = removePlayer(code, playerId);
          if (!updated) return;

          io.to(code).emit('player-left', { playerId, room: sanitizeRoom(updated, null) });
          if (wasDrawer) endRound(io, updated, code);
        }, 15000);

        disconnectedPlayers.set(sessionId, { roomCode: code, playerId, timeout });
        return;
      }

      // No sessionId — remove immediately
      const wasDrawer = room.status === 'playing' && room.currentDrawer === socket.id;
      const updated = removePlayer(code, socket.id);
      if (!updated) return;

      io.to(code).emit('player-left', { playerId: socket.id, room: sanitizeRoom(updated, null) });
      if (wasDrawer) endRound(io, updated, code);
    });
  });
};

module.exports = { setupSocket };
