import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button';

const messageStyle = (msg, currentUserId) => {
  if (msg.type === 'correct-guess') return 'bg-green-100 text-green-700 font-bold self-center text-center w-full';
  if (msg.type === 'system') return 'bg-blue-50 text-blue-500 self-center text-center w-full text-xs';
  if (msg.playerId === currentUserId) return 'bg-purple-100 text-purple-800 self-end';
  return 'bg-gray-100 text-gray-700 self-start';
};

const Chat = ({
  messages, onSendMessage, isDrawer, currentUserId,
}) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onSendMessage(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border-2 border-purple-100 overflow-hidden">
      <div className="p-3 border-b border-purple-100 flex-shrink-0">
        <h3 className="font-bold text-purple-700 text-sm">💬 Chat & Guesses</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl px-3 py-2 text-sm max-w-[90%] break-words ${messageStyle(msg, currentUserId)}`}
            >
              {msg.type === 'message' && msg.playerId !== currentUserId && (
                <span className="font-bold text-purple-600 block text-xs mb-0.5">
                  {msg.username}
                </span>
              )}
              {msg.message}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-purple-100 flex-shrink-0">
        {isDrawer ? (
          <p className="text-center text-xs text-gray-400 font-semibold py-1">
            You&apos;re drawing — watch for guesses! ✏️
          </p>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your guess..."
              maxLength={50}
              className="flex-1 px-3 py-2 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-sm font-semibold text-gray-700 placeholder-gray-400"
            />
            <Button
              onClick={handleSend}
              variant="primary"
              size="sm"
              disabled={!input.trim()}
            >
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
