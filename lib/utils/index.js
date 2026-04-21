export const AVATARS = [
  { id: 'cat', emoji: '🐱', label: 'Cat' },
  { id: 'dog', emoji: '🐶', label: 'Dog' },
  { id: 'fox', emoji: '🦊', label: 'Fox' },
  { id: 'panda', emoji: '🐼', label: 'Panda' },
  { id: 'rabbit', emoji: '🐰', label: 'Rabbit' },
  { id: 'bear', emoji: '🐻', label: 'Bear' },
  { id: 'penguin', emoji: '🐧', label: 'Penguin' },
  { id: 'frog', emoji: '🐸', label: 'Frog' },
];

export const getAvatarById = (id) => AVATARS.find((a) => a.id === id) || AVATARS[0];

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getTimerColor = (timeLeft, total) => {
  const ratio = timeLeft / total;
  if (ratio > 0.5) return 'text-green-500';
  if (ratio > 0.25) return 'text-yellow-500';
  return 'text-red-500';
};

export const getTimerBarColor = (timeLeft, total) => {
  const ratio = timeLeft / total;
  if (ratio > 0.5) return 'bg-green-400';
  if (ratio > 0.25) return 'bg-yellow-400';
  return 'bg-red-400';
};
