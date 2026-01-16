import { useState, useRef } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Info,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import { FLOWER_TYPES1, COLORS, RIBBON_COLORS, RING_COLORS, COLOR_NAMES, } from '../../constants/index';
import bgJ from '../../assets/j_front.png';
import bgJ2 from '../../assets/j_back.png';
import { groupFlowers, calculateCustomPrice, captureSnapshot } from '../../utils/helpers';


const CustomizerView = ({ flowers, setFlowers, ribbon, setRibbon, ring, setRing, onAdd, onBack, editingId }) => {
  const [selectedType, setSelectedType] = useState(FLOWER_TYPES1[0]);
  const [selectedColor, setSelectedColor] = useState(
    Object.keys(FLOWER_TYPES1[0].colors)[0]
  );
  const [draggingId, setDraggingId] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const previewRef = useRef(null);
  const svgRef = useRef(null);

  const handleCaptureSnapshot = async () => {
    if (!svgRef.current) return null;
    return await captureSnapshot(svgRef.current);
  };

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


  const handlePointerDown = (e, id) => {
    e.target.setPointerCapture(e.pointerId);
    setDraggingId(id);
  };
  // เพิ่ม state สำหรับเก็บโหมดการทำงาน
  const [interactionMode, setInteractionMode] = useState('move'); // 'move' หรือ 'rotate'

  const handlePointerMove = (e) => {
    if (!draggingId || !previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    const flower = flowers.find(f => f.id === draggingId);
    if (!flower) return;

    if (interactionMode === 'move') {
      // --- Logic การลากตำแหน่งเดิม ---
      let x = ((e.clientX - rect.left) / rect.width) * 100;
      let y = ((e.clientY - rect.top) / rect.height) * 100;
      x = Math.max(5, Math.min(95, x));
      y = Math.max(5, Math.min(95, y));

      setFlowers(prev => prev.map(f => f.id === draggingId ? { ...f, x, y } : f));

    } else if (interactionMode === 'rotate') {
      // --- Logic การหมุนใหม่ ---
      // 1. หาจุดศูนย์กลางของดอกไม้ในหน่วย Pixel
      const centerX = rect.left + (flower.x / 100) * rect.width;
      const centerY = rect.top + (flower.y / 100) * rect.height;

      // 2. คำนวณระยะห่างระหว่างเมาส์กับจุดศูนย์กลาง
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // 3. ใช้ atan2 เพื่อหามุม (Radian) และแปลงเป็น Degree
      // + 90 เพื่อให้จุด Handle ที่อยู่ด้านบนเริ่มที่ 0 องศา
      const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

      setFlowers(prev => prev.map(f => f.id === draggingId ? { ...f, rotation: angle } : f));
    }
  };
  const handleAddToCart = async () => {
    setIsCapturing(true);
    const snapshot = await handleCaptureSnapshot();
    onAdd({
      name: `Custom Bouquet (${flowers.length} ดอก)`,
      price: calculateCustomPrice(flowers.length),
      details: flowers,
      snapshot: snapshot,
      ribbon, ring,
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
        className="mb-6 flex items-center text-[#8A9A7B] font-bold">
        <ArrowLeft size={18} className="mr-1" />
        {editingId ? 'ยกเลิกการแก้ไข' : 'กลับหน้าแรก'}
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div
            ref={previewRef}
            className="bg-white rounded-3xl shadow-sm border border-[#F0EAD6] relative aspect-[4/5] md:h-[600px] overflow-hidden select-none touch-none"
            style={{ touchAction: 'none' }}
          >
            {/* 1. LAYER หลังสุด (Background Back) */}
            <img
              src={bgJ2}
              alt="background-back"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />

            <h3 className="absolute top-6 left-6 text-[#8A9A7B] font-bold uppercase tracking-widest text-xs z-30 bg-white/80 px-2 py-1 rounded ">
              จัดวางตำแหน่งดอกไม้
            </h3>

{/* 2. LAYER กลาง (ดอกไม้) */}
<svg
  ref={svgRef}
  viewBox="0 0 100 125"
  className="w-full h-full relative z-10"
>
  {flowers.map(f => (
    <g
      key={f.id}
      transform={`translate(${f.x}, ${f.y})`}
      style={{ cursor: 'move' }}
    >
      {/* กลุ่มที่ใช้หมุนภาพและไอคอน */}
      <g transform={`rotate(${f.rotation || 0})`}>
        <image
          href={f.img}
          x={-25}
          y={-25}
          width={50}
          height={50}
          draggable={false}
          onPointerDown={(e) => {
            setInteractionMode('move');
            handlePointerDown(e, f.id);
          }}
        />

        {/* ปุ่มไอคอนสำหรับหมุน (Rotation Handle) */}
        <foreignObject
          x="-10"   // กึ่งกลางไอคอน (กว้าง 20 / 2)
          y="-40"   // ตำแหน่งความสูงเหนือรูปดอกไม้
          width="20"
          height="20"
        >
          <div
            style={{
              cursor: 'alias',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              fontSize: '14px',
              userSelect: 'none',
              // ใส่ background หรือ border เพิ่มได้ถ้าต้องการให้เห็นชัดขึ้น
              // backgroundColor: 'white',
              // borderRadius: '50%'
            }}
            onPointerDown={(e) => {
              e.stopPropagation(); // สำคัญมาก: กันไม่ให้ไปโดน event ลากของรูป
              setInteractionMode('rotate');
              handlePointerDown(e, f.id);
            }}
          >
             <RefreshCw className="w-1 h-1" />
          </div>
        </foreignObject>
      </g>
    </g>
  ))}
</svg>

            {/* 3. LAYER หน้าสุด (Background Front - เช่น ปากถุงหรือกระดาษห่อด้านหน้า) */}
            <img
              src={bgJ}
              alt="background-front"
              className="absolute inset-0 w-full h-full object-cover z-20 pointer-events-none"
            /* pointer-events-none สำคัญมาก เพื่อให้กดลากดอกไม้ที่อยู่ข้างหลังรูปนี้ได้ */
            />


            {flowers.length === 0 && <div className="absolute inset-0 flex items-top justify-center text-center p-40 text-gray-300 font-medium italic">เริ่มออกแบบดอกไม้ด้านขวา</div>}
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
                <p className="text-[10px] font-bold text-gray-400 mb-3 uppercase flex items-center gap-1">
                  <Info size={12} /> รายละเอียดช่อ (ลบได้):
                </p>

                <div className="flex flex-wrap gap-2">
                  {groupFlowers(flowers).map((g, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-600 border border-gray-100 flex items-center gap-2"
                    >


                      {/* ชื่อ + จำนวน */}
                      <span>
                        {g.name} ({COLOR_NAMES[g.color] || 'ไม่ระบุสี'}) x {g.count}
                      </span>

                      {/* ปุ่มลบ */}
                      <button
                        onClick={() => removeOneFlower(g.name, g.color)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {flowers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 mb-3 uppercase flex items-center gap-1">
                  <Info size={12} /> อะไหล่ที่เลือก:
                </p>

                <div className="flex flex-wrap gap-2">
                  {/* โบว์ */}
                  <span className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-600 border border-gray-100 flex items-center gap-2">
                    โบว์
                    <span
                      className="w-4 h-4 rounded-md border"
                      style={{ backgroundColor: ribbon }}
                    />
                  </span>

                  {/* โช่ */}
                  <span className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-600 border border-gray-100 flex items-center gap-2">
                    โช่
                    <span
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: ring }}
                    />
                  </span>
                </div>
              </div>
            )}


          </div>
        </div>
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-3xl border border-[#F0EAD6] shadow-sm">
            <h4 className="font-bold text-[#5D6D4E] mb-4 flex items-center gap-2">
              <PlusCircle size={18} /> 1. เลือกดอกไม้และสี
            </h4>

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

            </div>


            {/* ส่วนเลือกสี (Color Selection) - ดึงสีจาก selectedType โดยตรง */}
            <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">เลือกสีที่ต้องการ:</p>
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-3 mb-6">
              {Object.entries(selectedType.colors).map(([hex, data]) => (
                <button
                  key={hex}
                  onClick={() => setSelectedColor(hex)}
                  title={data.name}
                  className={`w-full aspect-square rounded-full border-2 transition-all ${selectedColor === hex ? 'border-gray-800 scale-110 shadow-md' : 'border-gray-200'
                    }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>

            {/* ปุ่มเพิ่มดอกไม้ */}
            <button
              onClick={addFlower}
              className="w-full py-4 bg-[#E9EDC9] text-[#5D6D4E] font-bold rounded-2xl hover:bg-[#CCD5AE] shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Plus size={20} /> เพิ่มดอกไม้ลงในช่อ
            </button>
          </section>
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


      </div>
    </div>
  );
};

export default CustomizerView;
