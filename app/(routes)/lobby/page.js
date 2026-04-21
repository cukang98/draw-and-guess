'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { connectSocket } from '@/lib/socket';
import UsernameInput from '@/components/lobby/UsernameInput';
import AvatarSelector from '@/components/lobby/AvatarSelector';
import CreateRoom from '@/components/lobby/CreateRoom';
import JoinRoom from '@/components/lobby/JoinRoom';

const LobbyPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('cat');
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    const trimmed = username.trim();
    if (!trimmed) { setError('Please enter your name!'); return false; }
    if (trimmed.length < 2) { setError('Name must be at least 2 characters!'); return false; }
    return true;
  };

  const getOrCreateSessionId = () => {
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem('sessionId', id);
    }
    return id;
  };

  const savePlayer = (socket, sessionId) => {
    sessionStorage.setItem('player', JSON.stringify({
      id: socket.id,
      sessionId,
      username: username.trim(),
      avatar,
    }));
  };

  const handleCreateRoom = () => {
    if (!validate()) return;
    setIsLoading(true);
    setError('');

    const sessionId = getOrCreateSessionId();
    const socket = connectSocket();
    const emit = () => {
      socket.emit('create-room', { username: username.trim(), avatar, sessionId, language }, (res) => {
        setIsLoading(false);
        if (res.success) {
          savePlayer(socket, sessionId);
          router.push(`/room/${res.room.code}`);
        } else {
          setError(res.error || 'Failed to create room');
        }
      });
    };

    if (socket.connected) emit();
    else socket.once('connect', emit);
  };

  const handleJoinRoom = (roomCode) => {
    if (!validate()) return;
    setIsLoading(true);
    setError('');

    const sessionId = getOrCreateSessionId();
    const socket = connectSocket();
    const emit = () => {
      socket.emit('join-room', { roomCode, username: username.trim(), avatar, sessionId }, (res) => {
        setIsLoading(false);
        if (res.success) {
          savePlayer(socket, sessionId);
          router.push(`/room/${roomCode}`);
        } else {
          setError(res.error || 'Failed to join room');
        }
      });
    };

    if (socket.connected) emit();
    else socket.once('connect', emit);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
            className="text-6xl mb-4 inline-block"
          >
            🎨
          </motion.div>
          <h1 className="text-5xl font-black text-purple-700 mb-2">Draw & Guess</h1>
          <p className="text-gray-400 font-semibold text-lg">Sketch it. Guess it. Win it.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6">
          <UsernameInput value={username} onChange={setUsername} />
          <AvatarSelector selected={avatar} onSelect={setAvatar} />

          <div>
            <p className="text-sm font-bold text-gray-500 mb-2">Word Language (for new rooms)</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex-1 py-2.5 rounded-2xl font-bold text-sm transition-all border-2 ${
                  language === 'en'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('zh')}
                className={`flex-1 py-2.5 rounded-2xl font-bold text-sm transition-all border-2 ${
                  language === 'zh'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300'
                }`}
              >
                🇨🇳 中文
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm font-semibold text-center bg-red-50 border border-red-100 rounded-2xl p-3"
            >
              ⚠️ {error}
            </motion.p>
          )}

          <div className="flex flex-col gap-4">
            <CreateRoom onCreateRoom={handleCreateRoom} isLoading={isLoading} />

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-sm font-bold">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <JoinRoom onJoinRoom={handleJoinRoom} isLoading={isLoading} />
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6 font-semibold">
          Up to 8 players per room • 3 rounds per game
        </p>
      </motion.div>
    </div>
  );
};

export default LobbyPage;
