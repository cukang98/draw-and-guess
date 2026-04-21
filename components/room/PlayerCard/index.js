import { motion } from 'framer-motion';
import Avatar from '@/components/common/Avatar';

const PlayerCard = ({ player, isHost, isCurrentUser }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    layout
    className={[
      'flex items-center gap-3 p-4 rounded-2xl border-2 transition-all',
      isCurrentUser
        ? 'border-purple-300 bg-purple-50'
        : 'border-gray-100 bg-white shadow-sm',
    ].join(' ')}
  >
    <Avatar avatarId={player.avatar} size="md" />

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-gray-800 truncate">{player.username}</span>
        {isHost && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
            Host
          </span>
        )}
        {isCurrentUser && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
            You
          </span>
        )}
      </div>
    </div>

    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 font-semibold">
        {player.isReady ? 'Ready' : 'Not ready'}
      </span>
      <div
        className={[
          'w-3 h-3 rounded-full transition-colors',
          player.isReady ? 'bg-green-400' : 'bg-gray-300',
        ].join(' ')}
      />
    </div>
  </motion.div>
);

export default PlayerCard;
