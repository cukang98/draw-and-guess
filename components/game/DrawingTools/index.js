import { motion } from 'framer-motion';
import Button from '@/components/common/Button';

const COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
  '#6b7280', '#a16207', '#7c3aed', '#0ea5e9', '#84cc16',
];

const BRUSH_SIZES = [2, 5, 10, 18, 28];

const DrawingTools = ({
  color, setColor, brushSize, setBrushSize, onClear,
}) => (
  <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl p-3 border-2 border-purple-100 shadow-sm">
    <div className="flex flex-wrap gap-1.5">
      {COLORS.map((c) => (
        <motion.button
          key={c}
          type="button"
          onClick={() => setColor(c)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className={[
            'w-7 h-7 rounded-full border-2 transition-all flex-shrink-0',
            color === c ? 'border-purple-500 scale-110 shadow-md' : 'border-gray-300',
            c === '#ffffff' ? 'shadow-inner' : '',
          ].join(' ')}
          style={{ backgroundColor: c }}
          aria-label={`Color ${c}`}
        />
      ))}
    </div>

    <div className="w-px h-8 bg-gray-200 hidden sm:block" />

    <div className="flex items-center gap-2">
      {BRUSH_SIZES.map((s) => (
        <motion.button
          key={s}
          type="button"
          onClick={() => setBrushSize(s)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className={[
            'w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
            brushSize === s
              ? 'border-purple-400 bg-purple-50'
              : 'border-gray-200 bg-white',
          ].join(' ')}
          aria-label={`Brush size ${s}`}
        >
          <div
            className="rounded-full bg-gray-700"
            style={{ width: `${s}px`, height: `${s}px` }}
          />
        </motion.button>
      ))}
    </div>

    <div className="w-px h-8 bg-gray-200 hidden sm:block" />

    <Button onClick={onClear} variant="danger" size="sm">
      🗑️ Clear
    </Button>
  </div>
);

export default DrawingTools;
