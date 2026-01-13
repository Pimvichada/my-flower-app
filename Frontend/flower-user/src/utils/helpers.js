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

// --- SVG Capture ---
export const captureSnapshot = async (svgRef) => {
  if (!svgRef) return null;
  
  const svgData = new XMLSerializer().serializeToString(svgRef);
  const canvas = document.createElement("canvas");
  const svgSize = svgRef.getBoundingClientRect();
  
  // Using high resolution for clear snapshot
  canvas.width = svgSize.width * 2; 
  canvas.height = svgSize.height * 2;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve) => {
    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
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

// --- Cart ID Generation ---
export const generateCartId = () => {
  return Math.random().toString(36).substr(2, 9);
};
