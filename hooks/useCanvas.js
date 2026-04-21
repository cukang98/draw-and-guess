import { useRef, useEffect, useCallback, useState } from 'react';

const useCanvas = ({ isDrawer, socket }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const drawLine = useCallback((ctx, from, to, strokeColor, size) => {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (!isDrawer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    isDrawing.current = true;
    lastPos.current = getPos(e, canvas);
  }, [isDrawer]);

  const handleMouseMove = useCallback((e) => {
    if (!isDrawer || !isDrawing.current || !lastPos.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const currentPos = getPos(e, canvas);

    drawLine(ctx, lastPos.current, currentPos, color, brushSize);

    if (socket) {
      socket.emit('draw-stroke', {
        from: lastPos.current,
        to: currentPos,
        color,
        brushSize,
      });
    }

    lastPos.current = currentPos;
  }, [isDrawer, color, brushSize, socket, drawLine]);

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
    lastPos.current = null;
  }, []);

  useEffect(() => {
    if (!socket) return undefined;

    const handleRemoteDraw = ({ from, to, color: c, brushSize: bs }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      drawLine(ctx, from, to, c, bs);
    };

    const handleClearCanvas = () => clearCanvas();

    socket.on('draw-stroke', handleRemoteDraw);
    socket.on('clear-canvas', handleClearCanvas);

    return () => {
      socket.off('draw-stroke', handleRemoteDraw);
      socket.off('clear-canvas', handleClearCanvas);
    };
  }, [socket, drawLine, clearCanvas]);

  return {
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    color,
    setColor,
    brushSize,
    setBrushSize,
    clearCanvas,
  };
};

export default useCanvas;
