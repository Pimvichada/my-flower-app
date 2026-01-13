import { useState, useRef } from "react";
import { ArrowLeft, Plus, Trash2, Info, PlusCircle } from "lucide-react";
import {
  FLOWER_TYPES1,
  COLORS,
  RIBBON_COLORS,
  RING_COLORS,
} from "../../constants/index";
import {
  groupFlowers,
  calculateCustomPrice,
  captureSnapshot,
} from "../../utils/helpers";

const CustomizerView = ({
  flowers,
  setFlowers,
  ribbon,
  setRibbon,
  ring,
  setRing,
  onAdd,
  onBack,
  editingId,
}) => {
  const [selectedType, setSelectedType] = useState(FLOWER_TYPES1[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [draggingId, setDraggingId] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const previewRef = useRef(null);
  const svgRef = useRef(null);

  const handleCaptureSnapshot = async () => {
    if (!svgRef.current) return null;
    return await captureSnapshot(svgRef.current);
  };

  const addFlower = () => {
    const newFlower = {
      ...selectedType,
      color: selectedColor,
      id: Date.now(),
      x: 50,
      y: 40,
      rotation: Math.random() * 40 - 20,
    };
    setFlowers([...flowers, newFlower]);
  };

  const removeOneFlower = (name, color) => {
    const indexToRemove = [...flowers]
      .reverse()
      .findIndex((f) => f.name === name && f.color === color);
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
    setFlowers((prev) =>
      prev.map((f) => (f.id === draggingId ? { ...f, x: newX, y: newY } : f))
    );
  };

  const handleAddToCart = async () => {
    setIsCapturing(true);
    const snapshot = await handleCaptureSnapshot();
    onAdd({
      name: `Custom Bouquet (${flowers.length} ดอก)`,
      price: calculateCustomPrice(flowers.length),
      details: [...flowers],
      snapshot: snapshot,
      ribbon,
      ring,
      type: "custom",
    });
    setIsCapturing(false);
  };

  return (
    <div
      className="min-h-screen bg-[#FDFBF7] p-4 md:p-8"
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDraggingId(null)}
    >
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-[#8A9A7B] font-bold no-print"
      >
        <ArrowLeft size={18} className="mr-1" />{" "}
        {editingId ? "ยกเลิกการแก้ไข" : "กลับหาแรก"}
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <div
            ref={previewRef}
            className="bg-white rounded-3xl shadow-sm border border-[#F0EAD6] relative aspect-[4/5] md:h-[600px] overflow-hidden select-none touch-none"
            style={{ touchAction: "none" }}
          >
            <h3 className="absolute top-6 left-6 text-[#8A9A7B] font-bold uppercase tracking-widest text-xs z-20 bg-white/80 px-2 py-1 rounded ">
              จัดวางตำแหน่งดอกไม้
            </h3>

            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox="0 0 100 125"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full backgroundimage{j.png}"
            >
              {flowers.length > 0 && (
                <g className="opacity-40">
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
              {flowers.map((f) => (
                <g
                  key={f.id}
                  onPointerDown={(e) => handlePointerDown(e, f.id)}
                  style={{ cursor: "move" }}
                  transform={`translate(${f.x}, ${f.y}) rotate(${f.rotation})`}
                >
                  <circle cx="0" cy="0" r="14" fill="transparent" />
                  <g transform="translate(-14, -14) scale(1.15)">
                    <path d={f.svg} fill={f.color} className="drop-shadow-md" />
                  </g>
                </g>
              ))}
            </svg>

            {flowers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-center p-8 text-gray-300 font-medium italic">
                เริ่มออกแบบดอกไม้ด้านขวา
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#F0EAD6]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col text-[#5D6D4E]">
                <span className="text-xs font-bold uppercase opacity-60">
                  ยอดรวมช่อนี้
                </span>
                <span className="text-2xl font-bold">
                  {calculateCustomPrice(flowers.length)} บาท
                </span>
              </div>
              <button
                disabled={flowers.length < 1 || isCapturing}
                onClick={handleAddToCart}
                className={`px-8 py-4 rounded-full font-bold transition-all shadow-lg ${
                  flowers.length > 0 && !isCapturing
                    ? "bg-[#8A9A7B] text-white hover:bg-[#6D7D5E]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isCapturing
                  ? "กำลังบันทึกภาพ..."
                  : editingId
                  ? "บันทึกการแก้ไข"
                  : "ใส่ตะกร้าสินค้า"}
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
                      {g.name} x {g.count}
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
          </div>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-6 rounded-3xl border border-[#F0EAD6] shadow-sm">
            <h4 className="font-bold text-[#5D6D4E] mb-4 flex items-center gap-2">
              <PlusCircle size={18} /> 1. เลือกดอกไม้และสี
            </h4>
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2 no-scrollbar">
              {FLOWER_TYPES1.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={`p-4 rounded-2xl border-2 transition-all flex-shrink-0 flex flex-col items-center gap-2 min-w-[8px]  ${
                    selectedType.id === type.id
                      ? "border-[#8A9A7B] bg-[#F8F9F4]"
                      : "border-transparent bg-gray-50"
                  }`}
                >
                  <div className="w-8 h-20">
                    <img
                      src={type.img}
                      alt={type.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase">
                    {type.name}
                  </span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-9 gap-3 mb-6">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-full aspect-square rounded-full border-4 transition-all ${
                    selectedColor === c
                      ? "border-gray-800 scale-110 shadow-md"
                      : "border-white"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
                <label className="text-[10px] font-bold opacity-60 block mb-2 uppercase">
                  สีโบว์
                </label>
                <div className="flex flex-wrap gap-2">
                  {RIBBON_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setRibbon(c)}
                      className={`w-8 h-8 rounded-lg border-2 ${
                        ribbon === c
                          ? "border-gray-800 shadow-sm"
                          : "border-white"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold opacity-60 block mb-2 uppercase">
                  สีห่วง
                </label>
                <div className="flex flex-wrap gap-2">
                  {RING_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setRing(c)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        ring === c
                          ? "border-gray-800 shadow-sm"
                          : "border-white"
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      <div className="w-3 h-3 rounded-full border border-black/10"></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomizerView;
