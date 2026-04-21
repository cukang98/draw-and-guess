import { motion } from 'framer-motion';
import { AVATARS } from '@/lib/utils';

const AvatarSelector = ({ selected, onSelect }) => (
  <div className="w-full">
    <p className="text-sm font-bold text-purple-700 mb-3">Choose Your Avatar</p>
    <div className="grid grid-cols-4 gap-2">
      {AVATARS.map((avatar) => (
        <motion.button
          key={avatar.id}
          type="button"
          onClick={() => onSelect(avatar.id)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={[
            'flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all duration-200',
            selected === avatar.id
              ? 'border-purple-400 bg-purple-50 shadow-md'
              : 'border-gray-200 hover:border-purple-200 bg-white',
          ].join(' ')}
        >
          <span className="text-3xl">{avatar.emoji}</span>
          <span className="text-xs font-semibold text-gray-600">{avatar.label}</span>
        </motion.button>
      ))}
    </div>
  </div>
);

export default AvatarSelector;
