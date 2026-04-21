'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { connectSocket } from '@/lib/socket';
import RoomHeader from '@/components/room/RoomHeader';
import PlayerList from '@/components/room/PlayerList';
import Button from '@/components/common/Button';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-5xl mb-4"
      >
        🎨
      </motion.div>
      <p className="text-purple-600 font-bold text-lg">Loading room...</p>
    </div>
  </div>
);

const RoomPage = () => {
  const router = useRouter();
  const { roomCode } = useParams();

  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('player');
    if (!raw) { router.push('/lobby'); return; }
    setPlayer(JSON.parse(raw));
  }, [router]);

  useEffect(() => {
    if (!player) return undefined;

    const socket = connectSocket();

    const handleRoomUpdated = ({ room: updated }) => setRoom(updated);
    const handlePlayerLeft = ({ room: updated }) => { if (updated) setRoom(updated); };
    const handleGameStarted = () => router.push(`/game/${roomCode}`);

    socket.on('room-updated', handleRoomUpdated);
    socket.on('player-left', handlePlayerLeft);
    socket.on('game-started', handleGameStarted);

    const fetchRoom = () => {
      // socket.id differs from player.id means socket reconnected after a page refresh
      const needsRejoin = player.sessionId && socket.id && socket.id !== player.id;
      if (needsRejoin) {
        socket.emit('rejoin-room', { roomCode, sessionId: player.sessionId }, (res) => {
          if (res?.success) {
            const updated = { ...player, id: socket.id };
            sessionStorage.setItem('player', JSON.stringify(updated));
            setPlayer(updated);
            setRoom(res.room);
          } else {
            router.push('/lobby');
          }
        });
      } else {
        socket.emit('get-room', { roomCode }, (res) => {
          if (res?.success) setRoom(res.room);
          else router.push('/lobby');
        });
      }
    };

    if (socket.connected) fetchRoom();
    else socket.once('connect', fetchRoom);

    return () => {
      socket.off('room-updated', handleRoomUpdated);
      socket.off('player-left', handlePlayerLeft);
      socket.off('game-started', handleGameStarted);
    };
  }, [player, roomCode, router]);

  const handleToggleReady = useCallback(() => {
    connectSocket().emit('toggle-ready');
  }, []);

  const handleStartGame = useCallback(() => {
    setIsStarting(true);
    setError('');
    connectSocket().emit('start-game', {}, (res) => {
      if (!res.success) {
        setError(res.error || 'Failed to start game');
        setIsStarting(false);
      }
    });
  }, []);

  if (!room || !player) return <LoadingScreen />;

  const isHost = room.host === player.id;
  const currentPlayer = room.players.find((p) => p.id === player.id);
  const nonHostPlayers = room.players.filter((p) => p.id !== room.host);
  const allReady = room.players.length >= 2 && nonHostPlayers.every((p) => p.isReady);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6">
          <RoomHeader roomCode={roomCode} language={room.language} />

          <PlayerList
            players={room.players}
            hostId={room.host}
            currentUserId={player.id}
          />

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-sm font-semibold text-center bg-red-50 rounded-2xl p-3"
              >
                ⚠️ {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-3">
            {!isHost && (
              <Button
                onClick={handleToggleReady}
                variant={currentPlayer?.isReady ? 'success' : 'secondary'}
                size="lg"
                className="w-full"
              >
                {currentPlayer?.isReady ? '✅ Ready!' : '🙋 Ready Up'}
              </Button>
            )}

            {isHost && (
              <>
                <Button
                  onClick={handleStartGame}
                  disabled={!allReady || isStarting || room.players.length < 2}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  {isStarting ? '🚀 Starting...' : '🎮 Start Game'}
                </Button>
                {room.players.length < 2 && (
                  <p className="text-center text-sm text-gray-400 font-semibold">
                    Need at least 2 players to start
                  </p>
                )}
                {room.players.length >= 2 && !allReady && (
                  <p className="text-center text-sm text-gray-400 font-semibold">
                    Waiting for all players to ready up...
                  </p>
                )}
              </>
            )}

            <Button
              onClick={() => router.push('/lobby')}
              variant="ghost"
              size="sm"
              className="w-full"
            >
              🚪 Leave Room
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoomPage;
