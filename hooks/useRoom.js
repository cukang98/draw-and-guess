import { useState, useCallback } from 'react';

const useRoom = () => {
  const [room, setRoom] = useState(null);

  const updateRoom = useCallback((updatedRoom) => {
    setRoom(updatedRoom);
  }, []);

  return { room, updateRoom, setRoom };
};

export default useRoom;
