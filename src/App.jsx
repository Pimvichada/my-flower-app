import React, { useState, useEffect, useRef } from 'react';
import payment from './assets/payment.jpg';
import f1 from './assets/f1.png';


import { 
  Flower, 
  ShoppingCart, 
  ChevronRight, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  CheckCircle, 
  Download, 
  Image as ImageIcon,
  Mail,
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Truck, 
  Move, 
  Info, 
  Edit2, 
  X, 
  PlusCircle,
  ZoomIn,
  Eye,
  Calendar,
  Clock
} from 'lucide-react';

//import Scene Components...

// --- Constants & Config ---
const SHIPPING_FEE = 25;
const BASE_FLOWERS_COUNT = 5;
const BASE_PRICE = 69;
const ADDITIONAL_FLOWER_PRICE = 10;

const FLOWER_TYPES1 = [
 { 
  id: 'f1', 
  name: 'f1', 
  color: '#FFF9C4', 
  img: <img src={f1} alt="f1" className="w-full h-full opacity-80" />,
},
  { id: 'f2', name: 'Tulip', color: '#FFCDD2', svg: 'M12 21c-3.3 0-6-2.7-6-6 0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6z' },
  { id: 'f3', name: 'Rose', color: '#F8BBD0', svg: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z' },
  { id: 'f4', name: 'Lavender', color: '#E1BEE7', svg: 'M12 2v20M9 7l3 3 3-3M9 12l3 3 3-3' },
  { id: 'f5', name: 'Sunflower', color: '#FFE082', svg: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' }
];

const FLOWER_TYPES = [
  { id: 'f1', name: 'Daisy', color: '#FFF9C4', svg: 'M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4z M12 12c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4-4 1.8-4 4z M12 12c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z M12 12c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4z' },
  { id: 'f2', name: 'Tulip', color: '#FFCDD2', svg: 'M12 21c-3.3 0-6-2.7-6-6 0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6z' },
  { id: 'f3', name: 'Rose', color: '#F8BBD0', svg: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z' },
  { id: 'f4', name: 'Lavender', color: '#E1BEE7', svg: 'M12 2v20M9 7l3 3 3-3M9 12l3 3 3-3' },
  { id: 'f5', name: 'Sunflower', color: '#FFE082', svg: 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' }
];

const COLOR_NAMES = {
  '#FFADAD': 'แดงพาสเทล', '#FFD6A5': 'ส้มพีช', '#FDFFB6': 'เหลืองนวล', 
  '#CAFFBF': 'เขียวอ่อน', '#9BFBC0': 'เขียวมิ้นต์', '#A0C4FF': 'ฟ้าสดใส', 
  '#BDB2FF': 'ม่วงลาเวนเดอร์', '#FFC6FF': 'ชมพูหวาน', '#FFFFFF': 'ขาวบริสุทธิ์'
};

const COLORS = Object.keys(COLOR_NAMES);
const RIBBON_COLORS = ['#FFB7B2', '#B2CEFE', '#B2F2BB', '#FFFFD1', '#E2F0CB', '#FFDAC1'];
const RING_COLORS = ['#C0C0C0', '#FFD700', '#B87333', '#000000'];

const PREMADE_SETS = [
  { id: 'p1', name: 'Sweet Pastel Set', price: 129, description: '8 ดอกไม้ พร้อมโบว์ชมพู', items: 8 },
  { id: 'p2', name: 'Sunlight Garden', price: 99, description: '6 ดอกไม้ พร้อมโบว์เหลือง', items: 6 },
  { id: 'p3', name: 'Ocean Breeze', price: 109, description: '7 ดอกไม้ พร้อมโบว์ฟ้า', items: 7 },
];

// --- Shared Components ---

const ImageModal = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print" onClick={onClose}>
      <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors z-10">
          <X size={20} className="text-gray-800" />
        </button>
        <img src={src} alt="Enlarged view" className="w-full h-auto" />
        <div className="p-4 bg-[#FDFBF7] text-center border-t">
          <p className="text-[#8A9A7B] font-bold text-sm">Flower For You 24 - Bouquet View</p>
        </div>
      </div>
    </div>
  );
};

// --- Background Components ---

const FallingBackground = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    // Generate 25 random falling items with larger sizes and varied speeds
    const newPetals = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,

      delay: -(Math.random() * 100),
      duration: 10 + Math.random() * 12, // Faster than before but still smooth

     

      size: 40 + Math.random() * 45, // Larger flowers as requested
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      //////
      // flowerType: FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)].img
      flowerType: FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)].svg
    }));
    setPetals(newPetals);
  }, []);

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

// --- Helpers ---
const groupFlowers = (flowers) => {
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

const calculateCustomPrice = (count) => {
  if (count === 0) return 0;
  const extra = Math.max(0, count - BASE_FLOWERS_COUNT);
  return BASE_PRICE + (extra * ADDITIONAL_FLOWER_PRICE);
};

// --- View Components ---

const HomeView = ({ onStartCustom, onGoCatalog }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-4 text-center relative overflow-hidden">
    <FallingBackground />
    
    <div className="mb-12 animate-fade-in text-[#5D6D4E] z-10 relative">
      <h1 className="text-6xl md:text-8xl font-serif mb-6 tracking-wide drop-shadow-md">Flower For You 24</h1>
      <p className="text-xl md:text-2xl font-light italic opacity-80 tracking-widest text-[#99908c] ">ลูกปัดดอกไม้แฮนด์เมดด้วยหัวใจ12345</p>
    </div>
    
    <div className="flex flex-col sm:flex-row gap-6 z-10 relative">
      <button 
        onClick={onStartCustom} 
        className="px-12 py-6 bg-[#8A9A7B] text-white rounded-full hover:bg-[#6D7D5E] transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 font-bold active:scale-95 text-xl"
      >
        <Plus size={24} /> ออกแบบเอง (Custom)
        
      </button>
      <button 
        onClick={onGoCatalog} 
        className="px-12 py-6 border-2 border-[#8A9A7B] text-[#8A9A7B] rounded-full hover:bg-[#8A9A7B] hover:text-white transition-all shadow-lg hover:shadow-xl font-bold flex items-center justify-center active:scale-95 text-xl bg-white/40 backdrop-blur-sm"
      >
        เลือกชุดที่มีอยู่แล้ว
      </button>
    </div>

    {/* Subtle blobs for depth */}
    <div className="absolute top-[-5%] left-[-10%] w-[40vw] h-[40vw] bg-[#E9EDC9] rounded-full blur-[120px] opacity-20"></div>
    <div className="absolute bottom-[-5%] right-[-10%] w-[50vw] h-[50vw] bg-[#CCD5AE] rounded-full blur-[140px] opacity-20"></div>
  </div>
);

const CustomizerView = ({ flowers, setFlowers, ribbon, setRibbon, ring, setRing, onAdd, onBack, editingId }) => {
  const [selectedType, setSelectedType] = useState(FLOWER_TYPES1[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [draggingId, setDraggingId] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const previewRef = useRef(null);
  const svgRef = useRef(null);

  const captureSnapshot = () => {
    if (!svgRef.current) return null;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement("canvas");
    const svgSize = svgRef.current.getBoundingClientRect();
    
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

  const addFlower = () => {
    const newFlower = { 
      ...selectedType, 
      color: selectedColor, 
      id: Date.now(),
      x: 50, y: 40,
      rotation: Math.random() * 40 - 20
    };
    setFlowers([...flowers, newFlower]);
  };

  const removeOneFlower = (name, color) => {
    const indexToRemove = [...flowers].reverse().findIndex(f => f.name === name && f.color === color);
    if (indexToRemove !== -1) {
      const actualIndex = flowers.length - 1 - indexToRemove;
      setFlowers(flowers.filter((_, i) => i !== actualIndex));
    }
  };

  const handlePointerDown = (e, id) => {
    e.target.setPointerCapture(e.pointerId);
    setDraggingId(id);
  };

  const handlePointerMove = (e) => {
    if (!draggingId || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    let newX = ((e.clientX - rect.left) / rect.width) * 100;
    let newY = ((e.clientY - rect.top) / rect.height) * 100;
    newX = Math.max(5, Math.min(95, newX));
    newY = Math.max(5, Math.min(95, newY));
    setFlowers(prev => prev.map(f => f.id === draggingId ? { ...f, x: newX, y: newY } : f));
  };

  const handleAddToCart = async () => {
    setIsCapturing(true);
    const snapshot = await captureSnapshot();
    onAdd({ 
      name: `Custom Bouquet (${flowers.length} ดอก)`, 
      price: calculateCustomPrice(flowers.length), 
      details: [...flowers], 
      snapshot: snapshot,
      ribbon, ring, 
      type: 'custom' 
    });
    setIsCapturing(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8" onPointerMove={handlePointerMove} onPointerUp={() => setDraggingId(null)}>
      <button onClick={onBack} className="mb-6 flex items-center text-[#8A9A7B] font-bold no-print">
        <ArrowLeft size={18} className="mr-1" /> {editingId ? 'ยกเลิกการแก้ไข' : 'กลับหาแรก'}
      </button>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div ref={previewRef} className="bg-white rounded-3xl shadow-sm border border-[#F0EAD6] relative aspect-[4/5] md:h-[600px] overflow-hidden select-none touch-none" style={{ touchAction: 'none' }}>
           
            <h3 className="absolute top-6 left-6 text-[#8A9A7B] font-bold uppercase tracking-widest text-xs z-20 bg-white/80 px-2 py-1 rounded ">
              จัดวางตำแหน่งดอกไม้
            </h3>
            
            <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 100 125" xmlns="http://www.w3.org/2000/svg" className="w-full h-full backgroundimage{j.png}">

              {flowers.length > 0 && (
                <g className="opacity-40">
                  <circle cx="50" cy="100" r="8" fill="none" stroke={ring} strokeWidth="2" />
                  <path d="M40 115 Q50 105 60 115 L55 125 L45 125 Z" fill={ribbon} />
                </g>
              )}
              {flowers.map((f) => (
                <g 
                  key={f.id} 
                  onPointerDown={(e) => handlePointerDown(e, f.id)}
                  style={{ cursor: 'move' }}
                  transform={`translate(${f.x}, ${f.y}) rotate(${f.rotation})`}
                >
                  <circle cx="0" cy="0" r="14" fill="transparent" />
                  <g transform="translate(-14, -14) scale(1.15)">
                    <path d={f.svg} fill={f.color} className="drop-shadow-md" />
                  </g>
                </g>
              ))}
            </svg>

            {flowers.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-center p-8 text-gray-300 font-medium italic">เริ่มออกแบบดอกไม้ด้านขวา</div>}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#F0EAD6]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col text-[#5D6D4E]">
                <span className="text-xs font-bold uppercase opacity-60">ยอดรวมช่อนี้</span>
                <span className="text-2xl font-bold">{calculateCustomPrice(flowers.length)} บาท</span>
              </div>
              <button disabled={flowers.length < 1 || isCapturing} onClick={handleAddToCart} className={`px-8 py-4 rounded-full font-bold transition-all shadow-lg ${flowers.length > 0 && !isCapturing ? 'bg-[#8A9A7B] text-white hover:bg-[#6D7D5E]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {isCapturing ? 'กำลังบันทึกภาพ...' : editingId ? 'บันทึกการแก้ไข' : 'ใส่ตะกร้าสินค้า'}
              </button>
            </div>
            {flowers.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 mb-3 uppercase flex items-center gap-1"><Info size={12}/> รายละเอียดช่อ (ลบได้):</p>
                <div className="flex flex-wrap gap-2">
                  {groupFlowers(flowers).map((g, idx) => (
                    <span key={idx} className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-600 border border-gray-100 flex items-center gap-2">
                      {g.name} x {g.count}
                      <button onClick={() => removeOneFlower(g.name, g.color)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-6 rounded-3xl border border-[#F0EAD6] shadow-sm">
            <h4 className="font-bold text-[#5D6D4E] mb-4 flex items-center gap-2"><PlusCircle size={18}/> 1. เลือกดอกไม้และสี</h4>
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2 no-scrollbar">
              {FLOWER_TYPES1.map(type => (
                <button key={type.id} onClick={() => setSelectedType(type)} className={`p-4 rounded-2xl border-2 transition-all flex-shrink-0 flex flex-col items-center gap-2 min-w-[8px]  ${selectedType.id === type.id ? 'border-[#8A9A7B] bg-[#F8F9F4]' : 'border-transparent bg-gray-50'}`}>
                  {/* <svg width="32" height="32" viewBox="0 0 24 24" fill={selectedType.id === type.id ? selectedColor : '#ccc'}><path d={type.svg} /></svg> */}

                  <div className="w-8 h-20">{type.img}</div>

                  <span className="text-[10px] font-bold uppercase">{type.name}</span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-3 mb-6">
              {COLORS.map(c => <button key={c} onClick={() => setSelectedColor(c)} className={`w-full aspect-square rounded-full border-4 transition-all ${selectedColor === c ? 'border-gray-800 scale-110 shadow-md' : 'border-white'}`} style={{ backgroundColor: c }} />)}
            </div>
            <button onClick={addFlower} className="w-full py-4 bg-[#E9EDC9] text-[#5D6D4E] font-bold rounded-2xl hover:bg-[#CCD5AE] shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"><Plus size={20} /> เพิ่มดอกไม้ลงในช่อ</button>
          </section>
          <section className="bg-white p-6 rounded-3xl border border-[#F0EAD6] shadow-sm text-[#5D6D4E]">
            <h4 className="font-bold mb-4">2. อะไหล่แถมฟรี!</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold opacity-60 block mb-2 uppercase">สีโบว์</label>
                <div className="flex flex-wrap gap-2">{RIBBON_COLORS.map(c => <button key={c} onClick={() => setRibbon(c)} className={`w-8 h-8 rounded-lg border-2 ${ribbon === c ? 'border-gray-800 shadow-sm' : 'border-white'}`} style={{ backgroundColor: c }} />)}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-60 block mb-2 uppercase">สีห่วง</label>
                <div className="flex flex-wrap gap-2">{RING_COLORS.map(c => <button key={c} onClick={() => setRing(c)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${ring === c ? 'border-gray-800 shadow-sm' : 'border-white'}`} style={{ backgroundColor: c }}><div className="w-3 h-3 rounded-full border border-black/10"></div></button>)}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const CatalogView = ({ onBack, onAdd }) => (
  <div className="min-h-screen bg-[#FDFBF7] p-8">
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-8 flex items-center text-[#8A9A7B] font-bold"><ArrowLeft size={18} className="mr-1" /> กลับหน้าแรก</button>
      <h2 className="text-4xl font-serif text-[#5D6D4E] mb-10 text-center">ชุดสำเร็จรูปยอดนิยม</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PREMADE_SETS.map(set => (
          <div key={set.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#F0EAD6] flex flex-col items-center group hover:shadow-xl transition-all">
            <div className="w-32 h-32 bg-[#FEFAE0] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Flower className="text-[#8A9A7B]" size={56} /></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{set.name}</h3>
            <p className="text-sm text-gray-400 text-center mb-6">{set.description}</p>
            <div className="mt-auto w-full text-center">
              <div className="font-bold text-2xl text-[#5D6D4E] mb-6">{set.price} บาท</div>
              <button onClick={() => onAdd({...set, snapshot: null, type: 'premade'})} className="w-full py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-md hover:bg-[#6D7D5E] transition-all">เลือกชุดนี้</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CartView = ({ cart, onRemove, onEdit, onCheckout, onAddMore, onViewImage }) => (
  <div className="min-h-screen bg-[#FDFBF7] p-8">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-serif text-[#5D6D4E] mb-8 flex items-center gap-4"><ShoppingCart size={32} /> ตะกร้าสินค้า</h2>
      {cart.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center border border-[#F0EAD6] shadow-sm">
          <p className="text-gray-400 italic mb-8 text-lg">ตะกร้าของคุณยังว่างอยู่นะ...</p>
          <button onClick={onAddMore} className="px-10 py-4 bg-[#8A9A7B] text-white rounded-full font-bold shadow-md active:scale-95 transition-all">ไปเลือกดอกไม้กัน!</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.cartId} className="bg-white p-6 rounded-3xl border border-[#F0EAD6] flex flex-col sm:flex-row gap-6 shadow-sm group">
                <div 
                  className="w-36 aspect-[4/5] bg-[#F8F9F4] rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-100 shrink-0 cursor-zoom-in"
                  onClick={() => item.snapshot && onViewImage(item.snapshot)}
                >
                  {item.snapshot ? (
                    <>
                      <img src={item.snapshot} alt="Arrangement" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                        <Eye className="text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </>
                  ) : (
                    <Flower className="text-[#8A9A7B] opacity-30" size={40} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start text-[#5D6D4E]">
                    <h4 className="text-xl font-bold">{item.name}</h4>
                    <div className="flex gap-2">
                      {item.type === 'custom' && <button onClick={() => onEdit(item)} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Edit2 size={20}/></button>}
                      <button onClick={() => onRemove(item.cartId)} className="p-2 text-red-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                    </div>
                  </div>
                  {item.type === 'custom' && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {groupFlowers(item.details).map((g, i) => <span key={i} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-bold text-gray-500">{g.name} x {g.count}</span>)}
                    </div>
                  )}
                  <div className="mt-4 font-bold text-[#5D6D4E] text-lg">{item.price} บาท</div>
                </div>
              </div>
            ))}
            <button onClick={onAddMore} className="w-full py-4 border-2 border-dashed border-[#8A9A7B]/40 text-[#8A9A7B] rounded-3xl font-bold hover:bg-[#8A9A7B]/5 transition-all flex items-center justify-center gap-2"><PlusCircle size={20} /> เลือกดอกไม้เพิ่ม</button>
          </div>
          <div className="space-y-6">
            <div className="bg-[#FEFAE0] p-8 rounded-3xl border border-[#F0EAD6] sticky top-24 shadow-sm text-[#5D6D4E]">
              <h3 className="font-bold text-xl mb-6 border-b border-[#5D6D4E]/10 pb-4 text-center">สรุปรายการชำระ</h3>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between"><span>ราคารวมสินค้า</span><span className="font-bold">{cart.reduce((s, i) => s + i.price, 0)} บาท</span></div>
                <div className="flex justify-between"><span>ค่าจัดส่ง</span><span className="font-bold">{SHIPPING_FEE} บาท</span></div>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-4 border-t border-[#5D6D4E]/20"><span>ยอดสุทธิ</span><span>{cart.reduce((s, i) => s + i.price, 0) + SHIPPING_FEE} บาท</span></div>
              <button onClick={onCheckout} className="w-full py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold mt-8 shadow-lg hover:bg-[#6D7D5E] transition-all active:scale-95">ดำเนินการชำระเงิน</button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

// --- Main App ---

const App = () => {
  const [step, setStep] = useState('home');
  const [cart, setCart] = useState([]);
  const [customFlowers, setCustomFlowers] = useState([]);
  const [selectedRibbon, setSelectedRibbon] = useState(RIBBON_COLORS[0]);
  const [selectedRing, setSelectedRing] = useState(RING_COLORS[0]);
  const [editingCartId, setEditingCartId] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', address: '', phone: '', email: '' });
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [orderTime, setOrderTime] = useState('');
  const [activePreviewImage, setActivePreviewImage] = useState(null);

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0) + (cart.length > 0 ? SHIPPING_FEE : 0);

  const handleAddToCart = (item) => {
    if (editingCartId) {
      setCart(cart.map(c => c.cartId === editingCartId ? { ...item, cartId: editingCartId } : c));
      setEditingCartId(null);
    } else {
      setCart([...cart, { ...item, cartId: Math.random().toString(36).substr(2, 9) }]);
    }
    setStep('cart');
  };

  const resetOrder = () => {
    setCart([]);
    setCustomFlowers([]);
    setStep('home');
    setPaymentSlip(null);
    setCustomerInfo({ name: '', address: '', phone: '', email: '' });
  };

  const renderContent = () => {
    switch (step) {
      case 'home': return <HomeView onStartCustom={() => { setCustomFlowers([]); setEditingCartId(null); setStep('custom'); }} onGoCatalog={() => setStep('catalog')} />;
      case 'catalog': return <CatalogView onBack={() => setStep('home')} onAdd={handleAddToCart} />;
      case 'custom': return (
        <CustomizerView flowers={customFlowers} setFlowers={setCustomFlowers} ribbon={selectedRibbon} setRibbon={setSelectedRibbon} ring={selectedRing} setRing={setSelectedRing} onAdd={handleAddToCart} onBack={() => setStep(editingCartId ? 'cart' : 'home')} editingId={editingCartId} />
      );
      case 'cart': return (
        <CartView cart={cart} onAddMore={() => setStep('home')} onRemove={(id) => setCart(cart.filter(i => i.cartId !== id))} onEdit={(item) => { setCustomFlowers([...item.details]); setSelectedRibbon(item.ribbon); setSelectedRing(item.ring); setEditingCartId(item.cartId); setStep('custom'); }} onCheckout={() => setStep('checkout')} onViewImage={setActivePreviewImage} />
      );
      case 'checkout': return (
        <div className="min-h-screen bg-[#FDFBF7] p-8 flex items-center justify-center">
          <div className="max-w-xl w-full bg-white p-10 rounded-3xl shadow-sm border border-[#F0EAD6]">
            <h2 className="text-3xl font-serif text-[#5D6D4E] mb-8 text-center underline decoration-dotted decoration-[#8A9A7B]">ข้อมูลผู้รับสินค้า</h2>
            <div className="space-y-4">
              <div className="relative">
                 <User className="absolute left-4 top-4 text-gray-300" size={20} />
                 <input type="text" placeholder="ชื่อ-นามสกุล" className="w-full pl-12 pr-4 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 focus:ring-[#8A9A7B] transition-all" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-4 text-gray-300" size={20} />
                  <input type="tel" placeholder="เบอร์โทรศัพท์" className="w-full pl-12 pr-4 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 focus:ring-[#8A9A7B] transition-all" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-gray-300" size={20} />
                  <input type="email" placeholder="อีเมล" className="w-full pl-12 pr-4 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 focus:ring-[#8A9A7B] transition-all" value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} />
                </div>
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-300" size={20} />
                <textarea placeholder="ที่อยู่จัดส่งโดยละเอียด" rows="4" className="w-full px-4 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 focus:ring-[#8A9A7B] transition-all" value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} />
              </div>
              <button onClick={() => setStep('payment')} disabled={!customerInfo.name || !customerInfo.address || !customerInfo.phone} className="w-full py-5 bg-[#8A9A7B] text-white rounded-2xl font-bold mt-4 shadow-md transition-all active:scale-95 disabled:bg-gray-200">ต่อไป: ชำระเงิน</button>
            </div>
          </div>
        </div>
      );
      case 'payment': return (
        <div className="min-h-screen bg-[#FDFBF7] p-8 flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-xl text-center border border-[#F0EAD6]">
            <h2 className="text-3xl font-serif text-[#5D6D4E] mb-2">ชำระเงิน</h2>
            <p className="text-3xl text-gray-400 mb-8 font-extrabold   decoration-[#5D6D4E]">ยอดชำระสุทธิ {totalPrice} บาท</p>
            <div className="bg-[#F8F9F4] p-6 rounded-3xl mb-8 flex justify-center border-4 border-[#5D6D4E]/10 shadow-inner">
               {/* <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=FlowerForYou24_Payment" alt="PromptPay" className="w-full h-full opacity-80" /> */}
               <img src={payment} alt="payment" className="w-full h-full opacity-80 rounded-lg" />
            </div>
            <div className="mb-8 text-left">
               <div className="relative border-2 border-dashed border-[#8A9A7B]/30 rounded-2xl p-8 cursor-pointer hover:bg-[#F8F9F4] transition-all">
                 <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setPaymentSlip(e.target.files[0])} />
                 <div className="flex flex-col items-center text-[#8A9A7B]">
                   <ImageIcon size={48} className="mb-2" />
                   <span className="text-xs font-bold uppercase">{paymentSlip ? paymentSlip.name : 'แนบหลักฐานการโอน'}</span>
                 </div>
               </div>
            </div>
            <button 
              onClick={() => { 
                setStep('verifying'); 
                setOrderId('ORD-'+Math.random().toString(36).toUpperCase().substr(2, 8)); 
                setOrderTime(new Date().toLocaleString('th-TH', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }));
                setTimeout(() => setStep('success'), 2000); 
              }} 
              disabled={!paymentSlip} 
              className="w-full py-5 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-lg active:scale-95 disabled:bg-gray-200"
            >
              ยืนยันการชำระเงิน
            </button>
          </div>
        </div>
      );
      case 'verifying': return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-8 border-[#8A9A7B] border-t-transparent rounded-full animate-spin mb-8 shadow-sm"></div>
          <h2 className="text-2xl font-serif text-[#5D6D4E]">กำลังตรวจสอบข้อมูล...</h2>
        </div>
      );
      case 'success': return (
        <div className="min-h-screen bg-[#FDFBF7] p-8 print:p-0">
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] border border-[#F0EAD6] shadow-xl print:shadow-none">
            <div className="text-center mb-8">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
              <h2 className="text-4xl font-serif text-[#5D6D4E]">สั่งซื้อสำเร็จ!</h2>
              <p className="text-gray-400 mt-2 font-medium">ขอบคุณที่อุดหนุน Flower For You 24</p>
            </div>
            
            {/* Receipt Header / Meta Info */}
            <div className="bg-[#F8F9F4] p-6 rounded-3xl mb-8 text-sm border border-gray-100">
               <div className="flex flex-col sm:flex-row justify-between border-b border-gray-200 pb-3 mb-3 gap-2">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">หมายเลขสั่งซื้อ</span>
                   <span className="font-mono font-bold text-[#5D6D4E] text-lg">{orderId}</span>
                 </div>
                 <div className="flex flex-col sm:items-end">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ชื่อผู้สั่งซื้อ</span>
                   <span className="font-bold text-gray-700">{customerInfo.name}</span>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                 <div className="flex items-center gap-2 text-gray-500">
                   <Calendar size={14} className="text-[#8A9A7B]" />
                   <span className="font-medium">วันที่สั่งซื้อ: {orderTime}</span>
                 </div>
                 <div className="flex items-start gap-2 text-gray-500">
                   <MapPin size={14} className="text-[#8A9A7B] shrink-0" />
                   <span className="leading-tight">{customerInfo.address}</span>
                 </div>
               </div>
            </div>

            <div className="space-y-6 mb-8 text-[#5D6D4E]">
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] border-b pb-2 border-gray-50">รายการที่สั่งซื้อ</h4>
              {cart.map(item => (
                <div key={item.cartId} className="flex gap-4 border-t pt-6 first:border-none group">
                  <div 
                    className="w-28 aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden relative shrink-0 border border-gray-100 cursor-zoom-in"
                    onClick={() => item.snapshot && setActivePreviewImage(item.snapshot)}
                  >
                    {item.snapshot ? (
                      <img src={item.snapshot} alt="Item" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : <Flower className="m-auto mt-6" size={32} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-lg">{item.name}</span>
                      <span className="text-gray-800">{item.price} บาท</span>
                    </div>
                    {item.type === 'custom' && (
                      <div className="mt-2 space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {groupFlowers(item.details).map((g, i) => <span key={i} className="text-[9px] bg-gray-100 px-2 py-0.5 rounded-full font-bold text-gray-400 uppercase tracking-tighter">{g.name} x {g.count}</span>)}
                        </div>
                        {item.details.length > BASE_FLOWERS_COUNT && <div className="text-[10px] font-bold text-[#8A9A7B] flex items-center gap-1"><PlusCircle size={10}/> เพิ่มดอกไม้พิเศษ {item.details.length - BASE_FLOWERS_COUNT} ดอก</div>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-6 space-y-3 text-sm border-gray-100">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span className="flex items-center gap-2"><Truck size={16}/> ค่าจัดส่ง (Standard Delivery)</span>
                  <span>{SHIPPING_FEE} บาท</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-bold text-[#5D6D4E] pt-4 border-t border-dashed border-gray-200">
                  <span className="text-lg uppercase tracking-wider opacity-60">ยอดรวมสุทธิ</span>
                  <span className="underline decoration-double underline-offset-8 decoration-[#8A9A7B]">{totalPrice} บาท</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <button onClick={() => window.print()} className="flex-1 py-4 border-2 border-[#8A9A7B] text-[#8A9A7B] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                <Download size={20}/> บันทึกใบเสร็จ (PDF) 
              </button>
              <button onClick={resetOrder} className="flex-1 py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-lg hover:bg-[#6D7D5E] transition-all active:scale-95">
                กลับหน้าหลัก
              </button>
            </div>
            
            <p className="mt-8 text-center text-[10px] text-gray-300 italic">ขอบคุณที่ให้โอกาส Flower For You 24 ได้ดูแลความรู้สึกของคุณ</p>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="font-sans text-gray-800 antialiased bg-[#FDFBF7] min-h-screen overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@400;700&family=Sarabun:wght@300;400;500;700&display=swap');
        body { font-family: 'Sarabun', sans-serif; }
        h1, h2, h3, h4, .font-serif { font-family: 'Noto Serif Thai', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        @keyframes fade-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        @keyframes fall {
          0% { transform: translateY(-15vh) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(115vh) rotate(360deg); opacity: 0; }
        }
        
        @media print { .no-print { display: none !important; } }
      `}</style>
      
      {step !== 'home' && step !== 'success' && (
        <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center no-print">
          <div className="font-serif text-[#5D6D4E] text-2xl font-bold cursor-pointer" onClick={() => setStep('home')}>Flower For You 24</div>
          <button onClick={() => setStep('cart')} className="relative p-3 bg-gray-50 rounded-2xl text-gray-600 hover:text-[#8A9A7B] transition-all">
            <ShoppingCart size={24} />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#8A9A7B] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">{cart.length}</span>}
          </button>
        </nav>
      )}

      <main className={step !== 'home' && step !== 'success' ? 'pt-24 pb-12' : ''}>
        {renderContent()}
      </main>

      <ImageModal src={activePreviewImage} onClose={() => setActivePreviewImage(null)} />
    </div>
  );
};

export default App;