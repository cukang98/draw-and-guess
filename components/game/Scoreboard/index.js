import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '@/components/common/Avatar';

const MEDALS = ['🥇', '🥈', '🥉'];

const Scoreboard = ({ players }) => {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white rounded-2xl border-2 border-purple-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-purple-100">
        <h3 className="font-bold text-purple-700 text-sm">🏆 Scoreboard</h3>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <AnimatePresence>
          {sorted.map((player, i) => (
            <motion.div
              key={player.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-50"
            >
              <span className="text-base w-6 text-center flex-shrink-0">
                {MEDALS[i] || `${i + 1}.`}
              </span>
              <Avatar avatarId={player.avatar} size="sm" />
              <span className="flex-1 font-bold text-gray-700 truncate text-sm">
                {player.username}
              </span>
              <motion.span
                key={player.score}
                initial={{ scale: 1.3, color: '#7c3aed' }}
                animate={{ scale: 1, color: '#6d28d9' }}
                className="font-black text-purple-700 text-sm tabular-nums"
              >
                {player.score}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Scoreboard;
