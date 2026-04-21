const rooms = new Map();

const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const createRoom = (hostId, hostData) => {
  let code;
  do {
    code = generateRoomCode();
  } while (rooms.has(code));

  const room = {
    code,
    host: hostId,
    language: hostData.language === 'zh' ? 'zh' : 'en',
    players: [
      {
        id: hostId,
        sessionId: hostData.sessionId || null,
        username: hostData.username,
        avatar: hostData.avatar,
        score: 0,
        isReady: false,
      },
    ],
    status: 'waiting',
    currentRound: 0,
    totalRounds: 3,
    currentDrawer: null,
    currentWord: null,
    drawOrder: [],
    guessedPlayers: [],
    roundTimer: null,
    roundTimeLeft: 0,
    roundDuration: 80,
    chatMessages: [],
  };

  rooms.set(code, room);
  return room;
};

const getRoom = (code) => rooms.get(code);

const addPlayer = (code, player) => {
  const room = rooms.get(code);
  if (!room) return null;
  if (room.players.length >= 8) return null;
  if (room.status !== 'waiting') return null;

  room.players.push({
    id: player.id,
    sessionId: player.sessionId || null,
    username: player.username,
    avatar: player.avatar,
    score: 0,
    isReady: false,
  });

  return room;
};

const removePlayer = (code, playerId) => {
  const room = rooms.get(code);
  if (!room) return null;

  room.players = room.players.filter((p) => p.id !== playerId);

  if (room.players.length === 0) {
    rooms.delete(code);
    return null;
  }

  if (room.host === playerId) {
    room.host = room.players[0].id;
  }

  return room;
};

const setPlayerReady = (code, playerId, isReady) => {
  const room = rooms.get(code);
  if (!room) return null;

  const player = room.players.find((p) => p.id === playerId);
  if (player) player.isReady = isReady;

  return room;
};

const updatePlayerId = (code, oldId, newId) => {
  const room = rooms.get(code);
  if (!room) return null;

  const player = room.players.find((p) => p.id === oldId);
  if (!player) return null;

  player.id = newId;

  if (room.host === oldId) room.host = newId;
  if (room.currentDrawer === oldId) room.currentDrawer = newId;

  if (room.drawOrder) {
    const idx = room.drawOrder.indexOf(oldId);
    if (idx !== -1) room.drawOrder[idx] = newId;
  }

  if (room.guessedPlayers) {
    const idx = room.guessedPlayers.indexOf(oldId);
    if (idx !== -1) room.guessedPlayers[idx] = newId;
  }

  return room;
};

const deleteRoom = (code) => {
  rooms.delete(code);
};

module.exports = {
  createRoom,
  getRoom,
  addPlayer,
  removePlayer,
  updatePlayerId,
  setPlayerReady,
  deleteRoom,
};
