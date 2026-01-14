import { useState, useRef } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Info,
  PlusCircle
} from 'lucide-react';

import {
  FLOWER_TYPES1,
  RIBBON_COLORS,
  RING_COLORS,
  COLOR_NAMES
} from '../../constants/index';

import bgJ from '../../assets/j.png';
import {
  groupFlowers,
  calculateCustomPrice,
  captureSnapshot
} from '../../utils/helpers';

const CustomizerView = ({
  flowers,
  setFlowers,
  ribbon,
  setRibbon,
  ring,
  setRing,
  onAdd,
  onBack,
  editingId
}) => {
  const [selectedType, setSelectedType] = useState(FLOWER_TYPES1[0]);
  const [selectedColor, setSelectedColor] = useState(
    Object.keys(FLOWER_TYPES1[0].colors)[0]
  );

  const [draggingId, setDraggingId] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const previewRef = useRef(null);
  const svgRef = useRef(null);

  /* ---------------- SNAPSHOT ---------------- */
  const handleCaptureSnapshot = async () => {
    if (!svgRef.current) return null;
    return await captureSnapshot(svgRef.current);
  };

  /* ---------------- ADD FLOWER ---------------- */
  const addFlower = () => {
    const img = selectedType.colors[selectedColor]?.img;
    if (!img) return;

    const newFlower = {
      id: Date.now(),
      name: selectedType.name,
      img,
      color: selectedColor,
      x: 50,
      y: 50,
      rotation: Math.random() * 40 - 20
    };

    setFlowers(prev => [...prev, newFlower]);
  };

  /* ---------------- REMOVE ONE ---------------- */
  const removeOneFlower = (name, color) => {
    const indexToRemove = [...flowers]
      .reverse()
      .findIndex(f => f.name === name && f.color === color);

    if (indexToRemove !== -1) {
      const actualIndex = flowers.length - 1 - indexToRemove;
      setFlowers(flowers.filter((_, i) => i !== actualIndex));
    }
  };

  /* ---------------- DRAG ---------------- */
  const handlePointerDown = (e, id) => {
    e.target.setPointerCapture(e.pointerId);
    setDraggingId(id);
  };

  const handlePointerMove = (e) => {
    if (!draggingId || !previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;

    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));

    setFlowers(prev =>
      prev.map(f =>
        f.id === draggingId ? { ...f, x, y } : f
      )
    );
  };

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = async () => {
    setIsCapturing(true);
    const snapshot = await handleCaptureSnapshot();

    onAdd({
      name: `Custom Bouquet (${flowers.length} ดอก)`,
      price: calculateCustomPrice(flowers.length),
      details: flowers,
      snapshot,
      ribbon,
      ring,
      type: 'custom'
    });

    setIsCapturing(false);
  };

  return (
    <div
      className="min-h-screen bg-[#FDFBF7] p-4 md:p-8"
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDraggingId(null)}
    >
      {/* BACK */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-[#8A9A7B] font-bold"
      >
        <ArrowLeft size={18} className="mr-1" />
        {editingId ? 'ยกเลิกการแก้ไข' : 'กลับหน้าแรก'}
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ================= LEFT ================= */}
        <div className="flex flex-col gap-4">

          {/* PREVIEW */}
          <div
            ref={previewRef}
            className="bg-white rounded-3xl border border-[#F0EAD6] relative aspect-[4/5] md:h-[600px] overflow-hidden"
            style={{
              backgroundImage: `url(${bgJ})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              touchAction: 'none'
            }}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 100 125"
              className="w-full h-full"
            >
              {/* โบว์ + โซ่ */}
              {flowers.length > 0 && (
                <g className="opacity-80">
                  <circle
                    cx="50"
                    cy="100"
                    r="8"
                    fill="none"
                    stroke={ring}
                    strokeWidth="2"
                  />
                  <path
                    d="M40 115 Q50 105 60 115 L55 125 L45 125 Z"
                    fill={ribbon}
                  />
                </g>
              )}

              {flowers.map(f => (
                <g
                  key={f.id}
                  transform={`translate(${f.x}, ${f.y}) rotate(${f.rotation})`}
                  onPointerDown={(e) => handlePointerDown(e, f.id)}
                  style={{ cursor: 'move' }}
                >
                  <image
                    href={f.img}
                    x={-14}
                    y={-14}
                    width={28}
                    height={28}
                    draggable={false}
                  />
                </g>
              ))}
            </svg>

            {flowers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300 italic">
                เริ่มออกแบบดอกไม้ด้านขวา
              </div>
            )}
          </div>

          {/* PRICE + DETAILS */}
          <div className="bg-white p-6 rounded-3xl border border-[#F0EAD6]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs font-bold text-gray-400">ยอดรวม</p>
                <p className="text-2xl font-bold">
                  {calculateCustomPrice(flowers.length)} บาท
                </p>
              </div>

              <button
                disabled={flowers.length === 0 || isCapturing}
                onClick={handleAddToCart}
                className={`px-8 py-4 rounded-full font-bold ${
                  flowers.length
                    ? 'bg-[#8A9A7B] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                ใส่ตะกร้า
              </button>
            </div>

            {/* DETAILS */}
            {flowers.length > 0 && (
              <div className="border-t pt-4">

                <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                  <Info size={12} /> รายละเอียดช่อ
                </p>

                {/* FLOWERS */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {groupFlowers(flowers).map((g, i) => (
                    <span
                      key={i}
                      className="bg-gray-50 px-3 py-1.5 rounded-full text-xs border flex items-center gap-2"
                    >
                      {g.name} ({COLOR_NAMES[g.color]}) x {g.count}
                      <button
                        onClick={() => removeOneFlower(g.name, g.color)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* ACCESSORIES */}
                <div className="pt-4 border-t">
                  <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                    <Info size={12} /> อะไหล่ที่เลือก
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border">
                      โบว์
                      <span
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: ribbon }}
                      />
                    </span>

                    <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border">
                      โซ่
                      <span
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: ring }}
                      />
                    </span>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="space-y-6">

          {/* FLOWER SELECT */}
          <section className="bg-white p-6 rounded-3xl border">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <PlusCircle size={18} /> เลือกดอกไม้
            </h4>

<<<<<<< HEAD
            <div className="flex gap-4 overflow-x-auto mb-4">
              {FLOWER_TYPES1.map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type);
                    setSelectedColor(Object.keys(type.colors)[0]);
                  }}
                  className={`p-3 rounded-xl border ${
                    selectedType.id === type.id
                      ? 'border-[#8A9A7B]'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={Object.values(type.colors)[0].img}
                    className="w-12 h-16 object-contain"
                  />
                  <p className="text-xs font-bold mt-1">{type.name}</p>
                </button>
              ))}
=======
            {/* ส่วนเลือกชนิดดอกไม้ (Flower Type Selection) */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2 no-scrollbar ">
              {FLOWER_TYPES1.map(type => {
                const isSelected = selectedType.id === type.id;
                const displayImg = isSelected
                  ? (type.colors[selectedColor]?.img || type.colors['#9E9E9E']?.img)
                  : type.colors['#9E9E9E']?.img;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type);
                      // ถ้าดอกไม้ใหม่ไม่มีสีเดิม ให้กลับไปสีเริ่มต้น
                      if (!type.colors[selectedColor]) {
                        setSelectedColor('#9E9E9E');
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all flex-shrink-0 flex flex-col items-center gap-2 min-w-[80px] ${isSelected ? 'border-[#8A9A7B] bg-[#F8F9F4]' : 'border-transparent bg-gray-50'
                      }`}
                  >

                    <div className="w-12 h-16 ">
                      <img
                        src={displayImg} // ใช้ตัวแปร displayImg ที่เราคำนวณไว้ด้านบน
                        alt={type.name}
                        className="w-full h-full object-contain transition-all duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase">{type.name}</span>
                  </button>
                );
              })}

>>>>>>> 7be87dffcaf3b04909b406f5a51dc1b496a634f8
            </div>

            {/* COLOR SELECT */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              {Object.entries(selectedType.colors).map(([hex, c]) => (
                <button
                  key={hex}
                  title={c.name}
                  onClick={() => setSelectedColor(hex)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === hex
                      ? 'border-gray-800'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>

            <button
              onClick={addFlower}
              className="w-full py-3 bg-[#E9EDC9] rounded-xl font-bold"
            >
              <Plus size={18} /> เพิ่มดอกไม้
            </button>
          </section>
<<<<<<< HEAD

          {/* ACCESSORIES */}
          <section className="bg-white p-6 rounded-3xl border">
            <h4 className="font-bold mb-4">อะไหล่แถม</h4>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold mb-2">โบว์</p>
                <div className="flex gap-2 flex-wrap">
                  {RIBBON_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setRibbon(c)}
                      className={`w-8 h-8 rounded border-2 ${
                        ribbon === c ? 'border-gray-800' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold mb-2">โซ่</p>
                <div className="flex gap-2 flex-wrap">
                  {RING_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setRing(c)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        ring === c ? 'border-gray-800' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
=======
          <section className="bg-white p-6 rounded-3xl border border-[#F0EAD6] shadow-sm text-[#5D6D4E]">
          <h4 className="font-bold mb-4">2. อะไหล่แถมฟรี!</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold opacity-60 block mb-2 uppercase">สีโบว์</label>
              <div className="flex flex-wrap gap-2">{RIBBON_COLORS.map(c => <button key={c} onClick={() => setRibbon(c)} className={`w-8 h-8 rounded-lg border-2 ${ribbon === c ? 'border-gray-800 shadow-sm' : 'border-gray-200'}`} style={{ backgroundColor: c }} />)}</div>
            </div>
            <div>
              <label className="text-[10px] font-bold opacity-60 block mb-2 uppercase">สีโซ่</label>
              <div className="flex flex-wrap gap-2">{RING_COLORS.map(c => <button key={c} onClick={() => setRing(c)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${ring === c ? 'border-gray-800 shadow-sm' : 'border-gray-200'}`} style={{ backgroundColor: c }}><div className="w-3 h-3 rounded-full border border-black/10"></div></button>)}</div>
            </div>
          </div>
        </section>
        </div>

        
>>>>>>> 7be87dffcaf3b04909b406f5a51dc1b496a634f8
      </div>
    </div>
  );
};

export default CustomizerView;
