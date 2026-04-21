import { getAvatarById } from '@/lib/utils';

const sizeClasses = {
  sm: 'text-xl w-8 h-8',
  md: 'text-3xl w-12 h-12',
  lg: 'text-5xl w-20 h-20',
};

const Avatar = ({
  avatarId,
  size = 'md',
  showName = false,
  name = '',
}) => {
  const avatar = getAvatarById(avatarId);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={[
          sizeClasses[size],
          'rounded-full bg-gradient-to-br from-purple-100 to-pink-100',
          'flex items-center justify-center border-2 border-purple-200',
        ].join(' ')}
      >
        {avatar.emoji}
      </div>
      {showName && name && (
        <span className="text-xs font-bold text-gray-600 truncate max-w-[80px]">
          {name}
        </span>
      )}
    </div>
  );
};

export default Avatar;
