import { BASE_FLOWERS_COUNT, BASE_PRICE, ADDITIONAL_FLOWER_PRICE } from '../constants/index';

// --- Flower Grouping ---
export const groupFlowers = (flowers) => {
  const groups = {};
  flowers.forEach(f => {
    const key = `${f.name}-${f.color}`;
    if (!groups[key]) {
      groups[key] = { ...f, count: 1 };
    } else {
      groups[key].count += 1;
    }
  });
  return Object.values(groups);
};

// --- Price Calculation ---
export const calculateCustomPrice = (count) => {
  if (count === 0) return 0;
  const extra = Math.max(0, count - BASE_FLOWERS_COUNT);
  return BASE_PRICE + (extra * ADDITIONAL_FLOWER_PRICE);
};



export const captureSnapshot = async (svgElement) => {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);

  const svgBlob = new Blob([svgString], {
    type: 'image/svg+xml;charset=utf-8',
  });

  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;

      const ctx = canvas.getContext('2d');
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
const dataURL = canvas.toDataURL();
      URL.revokeObjectURL(url);

      try {
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject('Canvas is tainted by cross-origin image');
      }
    };

    img.onerror = reject;
    img.src = url;
  });
};



// --- Order Generation ---
export const generateOrderId = () => {
  return 'ORD-' + Math.random().toString(36).toUpperCase().substr(2, 8);
};

export const formatOrderTime = () => {
  return new Date().toLocaleString('th-TH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
export const captureBouquetCanvas = async ({
  flowers,
  bgBack,
  bgFront,
  width = 1250,
  height = 1250 // ตามสัดส่วน 4:5 หรือ viewBox 100:125
}) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // เพิ่มเพื่อป้องกันปัญหาละเมิดลิขสิทธิ์ภาพ (Tainted Canvas)
      img.src = src;
      img.onload = () => resolve(img);
    });

  // 1. วาด Background หลัง
  const bgBackImg = await loadImage(bgBack);
  ctx.drawImage(bgBackImg, 0, 0, width, height);

  // 2. วาดดอกไม้
for (const f of flowers) {
  const img = await loadImage(f.img);

  // คำนวณตำแหน่ง (อ้างอิงจาก viewBox 100x125)
  const x = (f.x / 100) * width;
  const y = (f.y / 125) * height;

  // --- แก้ไขจุดนี้: รักษาอัตราส่วนรูปภาพ ---
  // กำหนดให้ความกว้างดอกไม้คือ 50% ของความกว้างช่อ (ตามที่ตั้งไว้ใน SVG width={50})
let flowerWidth = (26 / 100) * width;

// คำนวณความสูงจาก aspect ratio (คงเดิม)
const aspectRatio = img.height / img.width;
let flowerHeight = flowerWidth * aspectRatio;

// 🔥 ถ้าเป็นดอก f1 → แคบลง แต่สูงเท่าเดิม
if (f.id === 'f1') {
  flowerWidth *= 0.1; // แคบลง (ปรับค่าได้ เช่น 0.6 / 0.8)
}
 
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(((f.rotation || 0) * Math.PI) / 180);
  
  // วาดจากจุดกึ่งกลาง โดยใช้ค่า flowerWidth และ flowerHeight ที่คำนวณใหม่
  ctx.drawImage(
    img, 
    -flowerWidth / 2, 
    -flowerHeight / 2, 
    flowerWidth, 
    flowerHeight
  );
  ctx.restore();
}
  // 3. วาด Background หน้า (เช่น กระดาษห่อที่บังดอกไม้)
  const bgFrontImg = await loadImage(bgFront);
  ctx.drawImage(bgFrontImg, 0, 0, width, height);

  return canvas.toDataURL('image/png');
};

// --- Cart ID Generation ---
export const generateCartId = () => {
  return Math.random().toString(36).substr(2, 9);
};
