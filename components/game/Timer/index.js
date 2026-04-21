import { motion } from 'framer-motion';
import { formatTime, getTimerColor, getTimerBarColor } from '@/lib/utils';

const Timer = ({ timeLeft, totalTime }) => {
  const percentage = Math.max(0, (timeLeft / totalTime) * 100);
  const colorClass = getTimerColor(timeLeft, totalTime);
  const barColor = getTimerBarColor(timeLeft, totalTime);
  const isUrgent = timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      <motion.div
        animate={isUrgent ? { scale: [1, 1.12, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
        className={`text-2xl font-black tabular-nums ${colorClass}`}
      >
        {formatTime(timeLeft)}
      </motion.div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'linear' }}
        />
      </div>
    </div>
  );
};

export default Timer;
