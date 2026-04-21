import { motion } from 'framer-motion';

const WordDisplay = ({ word, wordLength, isDrawer, language }) => {
  const isZh = language === 'zh';
  if (isDrawer && word) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl px-6 py-3 text-center shadow-lg"
      >
        <p className="text-white text-xs font-bold uppercase tracking-widest mb-1 opacity-80">
          Draw this word
        </p>
        <p className="text-white text-2xl font-black uppercase tracking-widest">{word}</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl px-6 py-3 text-center border-2 border-purple-100 shadow-sm">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
        Guess the word
      </p>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {wordLength && Array.from({ length: wordLength }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className="w-5 h-0.5 bg-purple-300 rounded" />
        ))}
        {wordLength && (
          <span className="text-gray-400 text-sm ml-2 font-semibold">
            ({wordLength} {isZh ? '个字' : 'letters'})
          </span>
        )}
      </div>
    </div>
  );
};

export default WordDisplay;
