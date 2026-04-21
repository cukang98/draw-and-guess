'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { connectSocket } from '@/lib/socket';
import Canvas from '@/components/game/Canvas';
import Chat from '@/components/game/Chat';
import WordDisplay from '@/components/game/WordDisplay';
import Timer from '@/components/game/Timer';
import Scoreboard from '@/components/game/Scoreboard';
import ResultScreen from '@/components/game/ResultScreen';

const ROUND_DURATION = 80;

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
      <p className="text-purple-600 font-bold text-lg">Loading game...</p>
    </div>
  </div>
);

const GamePage = () => {
  const router = useRouter();
  const { roomCode } = useParams();

  const [player, setPlayer] = useState(null);
  const [gameState, setGameState] = useState({
    status: 'waiting',
    round: 0,
    totalRounds: 0,
    drawerId: null,
    word: null,
    wordLength: null,
    timeLeft: ROUND_DURATION,
    guessedPlayers: [],
    players: [],
    messages: [],
    language: 'en',
  });
  const [roundEndWord, setRoundEndWord] = useState('');
  const [showRoundEnd, setShowRoundEnd] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('player');
    if (!raw) { router.push('/lobby'); return; }
    setPlayer(JSON.parse(raw));
  }, [router]);

  useEffect(() => {
    if (!player) return undefined;

    const socket = connectSocket();

    socket.on('new-round', ({
      round, totalRounds, drawerId, word, wordLength, players, language,
    }) => {
      setShowRoundEnd(false);
      setGameState((prev) => ({
        ...prev,
        status: 'playing',
        round,
        totalRounds,
        drawerId,
        word,
        wordLength,
        players,
        messages: [],
        guessedPlayers: [],
        timeLeft: ROUND_DURATION,
        ...(language ? { language } : {}),
      }));
    });

    socket.on('timer-tick', ({ timeLeft }) => {
      setGameState((prev) => ({ ...prev, timeLeft }));
    });

    socket.on('new-message', (msg) => {
      setGameState((prev) => ({
        ...prev,
        messages: [...prev.messages, msg],
      }));
    });

    socket.on('correct-guess', ({ playerId, players }) => {
      setGameState((prev) => ({
        ...prev,
        players,
        guessedPlayers: [...prev.guessedPlayers, playerId],
      }));
    });

    socket.on('round-ended', ({ word, players }) => {
      setRoundEndWord(word);
      setShowRoundEnd(true);
      setGameState((prev) => ({ ...prev, players, status: 'roundEnd' }));
    });

    socket.on('game-ended', ({ players }) => {
      setShowRoundEnd(false);
      setGameState((prev) => ({ ...prev, players, status: 'gameEnd' }));
    });

    socket.on('player-left', ({ room }) => {
      if (room) setGameState((prev) => ({ ...prev, players: room.players }));
    });

    // Sync state if joining mid-session or after page refresh
    const applyRoomState = (res) => {
      if (!res?.success) return;
      const { room } = res;
      if (room.status === 'playing' && room.currentDrawer) {
        setGameState((prev) => ({
          ...prev,
          status: 'playing',
          drawerId: room.currentDrawer,
          word: room.currentWord,
          wordLength: room.wordLength,
          timeLeft: room.roundTimeLeft || ROUND_DURATION,
          guessedPlayers: room.guessedPlayers || [],
          players: room.players,
          messages: room.chatMessages || [],
          language: room.language || 'en',
        }));
      } else {
        setGameState((prev) => ({
          ...prev,
          language: room.language || 'en',
        }));
      }
    };

    const sync = () => {
      // socket.id differs from player.id means socket reconnected after a page refresh
      const needsRejoin = player.sessionId && socket.id && socket.id !== player.id;
      if (needsRejoin) {
        socket.emit('rejoin-room', { roomCode, sessionId: player.sessionId }, (res) => {
          if (res?.success) {
            const updated = { ...player, id: socket.id };
            sessionStorage.setItem('player', JSON.stringify(updated));
            setPlayer(updated);
          }
          applyRoomState(res);
        });
      } else {
        socket.emit('get-game-state', { roomCode }, applyRoomState);
      }
    };

    if (socket.connected) sync();
    else socket.once('connect', sync);

    return () => {
      socket.off('new-round');
      socket.off('timer-tick');
      socket.off('new-message');
      socket.off('correct-guess');
      socket.off('round-ended');
      socket.off('game-ended');
      socket.off('player-left');
    };
  }, [player, roomCode]);

  const handleSendMessage = useCallback((message) => {
    connectSocket().emit('send-message', { message });
  }, []);

  const handlePlayAgain = useCallback(() => {
    router.push(`/room/${roomCode}`);
  }, [router, roomCode]);

  const handleLeaveLobby = useCallback(() => {
    router.push('/lobby');
  }, [router]);

  if (!player) return <LoadingScreen />;

  const socket = connectSocket();
  const isDrawer = gameState.drawerId === player.id;
  const hasGuessed = gameState.guessedPlayers.includes(player.id);
  const drawerName = gameState.players.find((p) => p.id === gameState.drawerId)?.username;

  return (
    <div className="min-h-screen p-3 flex flex-col gap-3">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-3 shadow-sm border border-purple-100">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎨</span>
          <div>
            <p className="font-black text-purple-700 leading-none">Draw &amp; Guess</p>
            <p className="text-xs text-gray-400 font-semibold">Room: {roomCode}</p>
          </div>
        </div>

        {gameState.round > 0 && (
          <div className="text-center hidden sm:block">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Round</p>
            <p className="font-black text-purple-600 text-lg leading-none">
              {gameState.round}
              <span className="text-gray-400 text-sm font-semibold">
                /{gameState.totalRounds}
              </span>
            </p>
          </div>
        )}

        <div className="w-36">
          {gameState.status === 'playing' && (
            <Timer timeLeft={gameState.timeLeft} totalTime={ROUND_DURATION} />
          )}
        </div>
      </div>

      {/* Word / Drawer info */}
      {gameState.status === 'playing' && (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <WordDisplay
              word={gameState.word}
              wordLength={gameState.wordLength}
              isDrawer={isDrawer}
              language={gameState.language}
            />
          </div>
          {drawerName && (
            <div className="bg-white rounded-2xl px-4 py-3 border-2 border-purple-100 text-center flex-shrink-0">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Drawing</p>
              <p className="font-black text-purple-700 text-sm">{drawerName}</p>
            </div>
          )}
        </div>
      )}

      {/* Round-end banner */}
      <AnimatePresence>
        {showRoundEnd && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl p-4 text-center text-white shadow-lg"
          >
            <p className="font-black text-lg">
              Round Over! The word was:{' '}
              <span className="uppercase underline underline-offset-4">{roundEndWord}</span>
            </p>
            <p className="text-sm opacity-80 mt-0.5">Next round starting in 5 seconds…</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main game layout */}
      <div className="flex flex-col lg:flex-row gap-3 flex-1 min-h-0">
        {/* Canvas area */}
        <div className="flex-1">
          <Canvas isDrawer={isDrawer} socket={socket} />
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-72 flex flex-col gap-3" style={{ minHeight: '480px' }}>
          {gameState.players.length > 0 && (
            <Scoreboard players={gameState.players} />
          )}
          <div className="flex-1" style={{ minHeight: '280px' }}>
            <Chat
              messages={gameState.messages}
              onSendMessage={handleSendMessage}
              isDrawer={isDrawer}
              currentUserId={player.id}
            />
          </div>
        </div>
      </div>

      {/* Guessed toast */}
      <AnimatePresence>
        {hasGuessed && !isDrawer && gameState.status === 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-xl font-bold text-sm"
          >
            🎉 You guessed it! Waiting for others…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result screen overlay */}
      {gameState.status === 'gameEnd' && (
        <ResultScreen
          players={gameState.players}
          onPlayAgain={handlePlayAgain}
          onLeaveLobby={handleLeaveLobby}
        />
      )}
    </div>
  );
};

export default GamePage;
