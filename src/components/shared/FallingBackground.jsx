import { useState } from 'react';
import { COLORS, FLOWER_TYPES } from '../../constants/index';

const FallingBackground = () => {
  const [petals] = useState(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: -(Math.random() * 100),
      duration: 10 + Math.random() * 12,
      size: 40 + Math.random() * 45,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      flowerType: FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)].svg
    }));
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-0"
          style={{
            left: `${p.left}%`,
            top: `-10%`,
            animation: `fall ${p.duration}s linear ${p.delay}s infinite`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill={p.color}
            style={{ transform: `rotate(${p.rotation}deg)` }}
            className="w-full h-full drop-shadow-sm opacity-50"
          >
            <path d={p.flowerType} />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default FallingBackground;
