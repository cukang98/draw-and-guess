import { useState } from 'react';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

const JoinRoom = ({ onJoinRoom, isLoading }) => {
  const [roomCode, setRoomCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = roomCode.trim().toUpperCase();
    if (trimmed.length === 6) {
      onJoinRoom(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
      <Input
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        placeholder="Enter room code (e.g. AB1234)..."
        label="Join Existing Room"
        maxLength={6}
        onKeyDown={handleKeyDown}
      />
      <Button
        type="submit"
        disabled={isLoading || roomCode.trim().length !== 6}
        variant="secondary"
        className="w-full"
      >
        {isLoading ? '🔍 Joining...' : '🚪 Join Room'}
      </Button>
    </form>
  );
};

export default JoinRoom;
