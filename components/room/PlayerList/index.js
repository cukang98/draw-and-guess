import { AnimatePresence } from 'framer-motion';
import PlayerCard from '@/components/room/PlayerCard';

const PlayerList = ({ players, hostId, currentUserId }) => (
  <div className="flex flex-col gap-3">
    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">
      Players ({players.length}/8)
    </p>
    <AnimatePresence>
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          isHost={player.id === hostId}
          isCurrentUser={player.id === currentUserId}
        />
      ))}
    </AnimatePresence>
  </div>
);

export default PlayerList;
