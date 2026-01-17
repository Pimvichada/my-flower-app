import { useState } from 'react';
import { COLORS, FLOWER_TYPES2 } from '../../constants/index';

const FallingBackground = () => {
  const [petals] = useState(() => {
    return Array.from({ length: 25 }).map((_, i) => {
      // 1. สุ่มเลือกชนิดดอกไม้
      const randomFlower = FLOWER_TYPES2[Math.floor(Math.random() * FLOWER_TYPES2.length)];
      
      // 2. สุ่มเลือกสีจาก COLORS constant
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      

      const colorEntries = Object.values(randomFlower.colors);
      const flowerImageData = randomFlower.colors[randomColor] || colorEntries[0];

      return {
        id: i,
        left: Math.random() * 100,
        delay: -(Math.random() * 100),
        duration: 15 + Math.random() * 12,
        size: 40 + Math.random() * 45,
        rotation: Math.random() * 360,
        // ใช้ Optional Chaining (?.) กันพลาดอีกชั้น
        imageSrc: flowerImageData?.img || '', 
        name: randomFlower.name
        
      };
    });
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 no-print">
      {petals.map((p) => (
        // แสดงผลเฉพาะก้อนที่มีรูปภาพเท่านั้น
        p.imageSrc && (
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
           <img
            src={p.imageSrc}
            alt="flower"
            className="w-full h-full object-contain"
            style={{ 
              transform: `rotate(${p.rotation}deg)`,
              // 2. ปรับเฉดสีตรงนี้:
              // saturate(0.4) = ลดความสดของสีลง 60% (จะได้สีซีดๆ พาสเทล)
              // brightness(1.2) = เพิ่มความสว่างให้ดูนวลขึ้น
              filter: 'saturate(0.5) brightness(1.2)' 
            }}
          />
        </div>
        )
      ))}
    </div>
  );
};

export default FallingBackground;