import { Plus, Search, Package, Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import FallingBackground from '../shared/FallingBackground';

const HomeView = ({ onStartCustom, onGoCatalog }) => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!orderId) return alert("กรุณากรอกหมายเลขคำสั่งซื้อ");
    setLoading(true);
    setOrderData(null);

    try {
      // ตัวอย่างการเรียก API
      const response = await fetch(`http://72.62.243.238:5000/api/orders/track/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrderData(data);
      } else {
        alert("ไม่พบหมายเลขคำสั่งซื้อนี้");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-4 text-center relative overflow-hidden">
      <FallingBackground />

      {/* --- ส่วนค้นหา: มุมบนขวา (Absolute) --- */}
      <div className="absolute top-4 right-4 z-30 w-full max-w-[300px] md:max-w-sm">
        <div className="flex bg-white/80 backdrop-blur-md rounded-full shadow-md border border-[#8A9A7B]/30 overflow-hidden focus-within:border-[#8A9A7B] transition-all">
          <input 
            type="text" 
            placeholder="เลขออเดอร์..." 
            className="flex-1 px-4 py-2 outline-none text-[#5D6D4E] bg-transparent text-sm"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#8A9A7B] text-white px-4 py-2 hover:bg-[#6D7D5E] transition-colors disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          </button>
        </div>

       {/* ผลการค้นหาแบบ Popup ดีไซน์นุ่มฟู */}
{orderData && (
  <div className="mt-4 p-5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] border-2 border-[#F1F5E9] text-left animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden group">
    
    {/* พื้นหลังตกแต่งเบาๆ */}
    <div className="absolute top-0 right-0 w-24 h-24 bg-[#8A9A7B]/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />

    {/* ส่วนหัว: Order ID & Status */}
    <div className="flex justify-between items-center mb-4">
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Order Number</span>
        <span className="font-extrabold text-[#5D6D4E] text-sm">#{orderData.orderId}</span>
      </div>
      <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${
        orderData.status === 'rejected' ? 'bg-red-50 text-red-400' : 'bg-[#8A9A7B] text-white'
      }`}>
        {orderData.status === 'rejected' ? 'คำสั่งซื้อไม่สำเร็จ' : orderData.status}
      </span>
    </div>

    {/* ชื่อลูกค้า */}
    <div className="mb-3">
       <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
         👤 {orderData.customerName}
       </p>
    </div>

    {/* รายการดอกไม้: จัดให้ดูเหมือน List ในสมุดโน้ต */}
    <div className="bg-[#FAF9F6] p-3 rounded-2xl border border-dashed border-[#8A9A7B]/30">
      <ul className="space-y-1">
        {orderData.flowers.map((flower, idx) => (
          <li key={idx} className="text-xs text-gray-500 flex justify-between">
            <span>🌸 {flower.name}</span>
            <span className="font-medium text-[#8A9A7B]">{flower.price}.-</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 pt-2 border-t border-[#8A9A7B]/10 flex justify-between items-center">
        <span className="text-[10px] text-gray-400">ค่าส่ง: {orderData.summary.shippingCost}.-</span>
        <div className="text-right">
          <span className="text-[10px] block text-gray-400 leading-none">ยอดรวมทั้งหมด</span>
          <span className="text-lg font-black text-[#5D6D4E]">฿{orderData.summary.totalPrice}</span>
        </div>
      </div>
    </div>

    {/* ปุ่มปิดแบบตะมุตะมิ */}
    <button 
      onClick={() => setOrderData(null)} 
      className="w-full mt-4 py-2 text-[11px] font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100"
    >
      ปิด
    </button>
  </div>
)}
</div>
      {/* --- หัวข้อหลัก --- */}
      <div className="mb-12 animate-fade-in text-[#5D6D4E] z-10 relative mt-12">
        <h1 className="text-5xl md:text-8xl font-serif mb-4 tracking-wide drop-shadow-sm">Flower For You 24</h1>
        <p className="text-lg md:text-2xl font-light italic opacity-80 tracking-[0.2em] text-[#99908c]">Crafted Flower</p>
      </div>

      {/* --- ปุ่มเมนูหลัก: บรรทัดเดียวกัน --- */}
      <div className="flex flex-row gap-3 md:gap-6 z-10 relative w-full justify-center px-2">
        <button 
          onClick={onStartCustom} 
          className="flex-1 max-w-[240px] py-4 md:py-5 bg-[#8A9A7B] text-white rounded-full hover:bg-[#6D7D5E] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-bold active:scale-95 text-sm md:text-lg"
        >
          <Plus size={20} className="hidden xs:block" /> ออกแบบเอง
        </button>
        
        <button 
          onClick={onGoCatalog} 
          className="flex-1 max-w-[240px] py-4 md:py-5 border-2 border-[#8A9A7B] text-[#8A9A7B] rounded-full hover:bg-[#8A9A7B] hover:text-white transition-all shadow-md font-bold flex items-center justify-center active:scale-95 text-sm md:text-lg bg-white/40 backdrop-blur-sm"
        >
          เลือกชุดที่มีอยู่
        </button>
      </div>

      {/* Background Decor */}
      <div className="absolute top-[-5%] left-[-10%] w-[40vw] h-[40vw] bg-[#E9EDC9] rounded-full blur-[120px] opacity-20"></div>
      <div className="absolute bottom-[-5%] right-[-10%] w-[50vw] h-[50vw] bg-[#CCD5AE] rounded-full blur-[140px] opacity-20"></div>
    </div>
  );
};

export default HomeView;