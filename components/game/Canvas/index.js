import { useEffect } from 'react';
import DrawingTools from '@/components/game/DrawingTools';
import useCanvas from '@/hooks/useCanvas';

const Canvas = ({ isDrawer, socket }) => {
  const {
    canvasRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    color,
    setColor,
    brushSize,
    setBrushSize,
    clearCanvas,
  } = useCanvas({ isDrawer, socket });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 500);
  }, [canvasRef]);

  const handleClear = () => {
    clearCanvas();
    if (socket) socket.emit('clear-canvas');
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={(e) => { e.preventDefault(); handleMouseDown(e); }}
        onTouchMove={(e) => { e.preventDefault(); handleMouseMove(e); }}
        onTouchEnd={handleMouseUp}
        className={[
          'w-full rounded-2xl border-4 border-purple-200 bg-white shadow-inner block',
          isDrawer ? 'cursor-crosshair' : 'cursor-default',
        ].join(' ')}
        style={{ touchAction: 'none', height: '420px' }}
      />
      {isDrawer && (
        <DrawingTools
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          onClear={handleClear}
        />
      )}
    </div>
  );
};

export default Canvas;
