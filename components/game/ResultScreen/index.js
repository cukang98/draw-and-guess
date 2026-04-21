import { motion } from 'framer-motion';
import Avatar from '@/components/common/Avatar';
import Button from '@/components/common/Button';

const MEDALS = ['🥇', '🥈', '🥉'];

const ResultScreen = ({ players, onPlayAgain, onLeaveLobby }) => {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-500/70 to-pink-500/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: 2 }}
            className="text-6xl mb-3"
          >
            🏆
          </motion.div>
          <h2 className="text-3xl font-black text-purple-700">Game Over!</h2>
          {winner && (
            <p className="text-gray-500 font-semibold mt-1">
              <span className="text-purple-600 font-black">{winner.username}</span> wins! 🎉
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {sorted.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={[
                'flex items-center gap-3 p-3 rounded-2xl',
                i === 0 ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-50',
              ].join(' ')}
            >
              <span className="text-2xl w-8 text-center">{MEDALS[i] || `${i + 1}.`}</span>
              <Avatar avatarId={player.avatar} size="sm" />
              <span className="flex-1 font-bold text-gray-700 truncate">{player.username}</span>
              <span className="font-black text-purple-600 text-lg tabular-nums">
                {player.score}
                <span className="text-xs font-semibold text-gray-400 ml-1">pts</span>
              </span>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={onLeaveLobby} variant="secondary" className="flex-1">
            🏠 Lobby
          </Button>
          <Button onClick={onPlayAgain} variant="primary" className="flex-1">
            🎮 Play Again
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultScreen;
