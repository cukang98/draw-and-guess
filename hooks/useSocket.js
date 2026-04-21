import { useEffect, useRef } from 'react';
import { connectSocket } from '@/lib/socket';

const useSocket = (events = {}) => {
  const socket = connectSocket();
  const eventsRef = useRef(events);

  useEffect(() => {
    eventsRef.current = events;
  });

  useEffect(() => {
    const entries = Object.entries(eventsRef.current);

    entries.forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      entries.forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket]);

  return socket;
};

export default useSocket;
