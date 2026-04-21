import { motion } from 'framer-motion';

const LANGUAGE_LABEL = { en: '🇬🇧 English', zh: '🇨🇳 中文' };

const RoomHeader = ({ roomCode, language }) => (
  <div className="text-center">
    <h1 className="text-3xl font-black text-purple-700 mb-3">Waiting Room</h1>
    <div className="inline-flex flex-col items-center gap-1 bg-purple-50 border-2 border-purple-200 rounded-2xl px-8 py-4">
      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
        Room Code
      </span>
      <motion.span
        className="text-3xl font-black text-purple-600 tracking-widest"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {roomCode}
      </motion.span>
    </div>
    {language && (
      <div className="mt-2 inline-block bg-white border border-purple-100 rounded-full px-3 py-1 text-xs font-bold text-purple-500">
        {LANGUAGE_LABEL[language] || LANGUAGE_LABEL.en}
      </div>
    )}
    <p className="text-sm text-gray-400 font-semibold mt-1">
      Share this code with your friends!
    </p>
  </div>
);

export default RoomHeader;
