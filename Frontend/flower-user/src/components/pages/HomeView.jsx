import { Plus, Search, Loader2, Flower2, Instagram, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import FallingBackground from '../shared/FallingBackground';

const HomeView = ({ onStartCustom, onGoCatalog }) => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    const email = "flowerforyoushop.s@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      // ให้ข้อความหายไปหลังจาก 2 วินาที
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSearch = async () => {
    if (!orderId) return alert("กรุณากรอกหมายเลขคำสั่งซื้อ");
    setLoading(true);
    setOrderData(null);
    try {
      const response = await fetch(
        `http://72.62.243.238:5000/api/orders/track/${orderId}`
      );

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

      {/* ===== Overlay (ไว้รับคลิกข้างนอก) ===== */}
      {showSearch && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => {
            setShowSearch(false);
            setOrderId('');
          }}
        />
      )}
      <div className="absolute bottom-4 right-4 z-30 w-full max-w-[300px] md:max-w-sm">
        {!showSearch ? (
          <button
            onClick={() => setShowSearch(true)}
            className="ml-auto w-20 h-20 rounded-full bg-[#8A9A7B] shadow-md flex items-center justify-center text-white hover:bg-[#6D7D5E] transition-all"
          >
            <Search size={30} />
          </button>
        ) : (
          /* 🔎 ช่องค้นหายาว */
          <div
            className="
        flex bg-white/80 backdrop-blur-md rounded-full shadow-md border border-[#8A9A7B]/30 overflow-hidden focus-within:border-[#8A9A7B] transition-all animate-in slide-in-from-top-2 fade-in duration-300 w-full max-w-[420px]"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="เลขออเดอร์..."
              className="
        flex-1 px-6 py-4 outline-none text-[#5D6D4E] bg-transparent text-base"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="
          bg-[#8A9A7B] text-white px-6 hover:bg-[#6D7D5E] transition-colors disabled:bg-gray-400 flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <Search size={22} />
              )}
            </button>
          </div>

        )}
        {orderData && (
          <div className="mt-4 p-5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] border-2 border-[#F1F5E9] text-left animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#8A9A7B]/5 rounded-full -mr-10 -mt-10" />

            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Order Number
                </span>
                <div className="font-extrabold text-[#5D6D4E] text-sm">
                  #{orderData.orderId}
                </div>
                <div className=" text-gray-400 text-[11px]">
                  {new Date(orderData.orderTime).toLocaleDateString('th-TH', { year: '2-digit', month: '2-digit', day: '2-digit' })} {new Date(orderData.orderTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${orderData.status === 'rejected'
                ? 'bg-red-50 text-red-400'
                : 'bg-[#8A9A7B] text-white'
                }`}>
                {orderData.status === 'rejected'
                  ? 'คำสั่งซื้อไม่สำเร็จ'
                  : orderData.status}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-600 mb-3">
              👤 {orderData.customerName}
            </p>

            <div className="bg-[#FAF9F6] p-3 rounded-2xl border border-dashed border-[#8A9A7B]/30">
              <ul className="space-y-1">
                {orderData.flowers.map((flower, idx) => (
                  <li key={idx} className="text-xs text-gray-500 flex justify-between">
                    <span>🌸 {flower.name}</span>
                    <span className="font-medium text-[#8A9A7B]">
                      {flower.price}.-
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-2 pt-2 border-t border-[#8A9A7B]/10 flex justify-between">
                <span className="text-[10px] text-gray-400">
                  ค่าส่ง: {orderData.summary.shippingCost}.-
                </span>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">
                    ยอดรวมทั้งหมด
                  </span>
                  <span className="text-lg font-black text-[#5D6D4E]">
                    ฿{orderData.summary.totalPrice}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOrderData(null)}
              className="w-full mt-4 py-2 text-[11px] font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
            >
              ปิด
            </button>
          </div>
        )}
      </div>

      {/* ================= Title ================= */}
      <div className="mb-12 animate-fade-in text-[#5D6D4E] z-10 relative mt-12">
        <h1 className="text-5xl md:text-8xl font-serif mb-4 flex items-center justify-center gap-3">
          Flower
          <span className="italic font-light text-[#8A9A7B] inline-flex items-center gap-2">
            For
            {/* <Flower2
              className="text-[#5D6D4E] -translate-y-4"
              size={90}
            /> */}
          </span>
          <span className="italic font-light text-[#5D6D4E] inline-flex items-center gap-2">
            You
          </span>
        </h1>
        <p className="text-lg md:text-2xl font-light italic opacity-80 tracking-[0.2em] text-[#99908c]">
          Crafted Flower
        </p>
      </div>

      {/* ================= Main Buttons ================= */}
      <div className="flex flex-row gap-3 md:gap-6 z-10 relative w-full justify-center px-2">
        <button
          onClick={onStartCustom}
          className="flex-1 max-w-[240px] py-4 md:py-5 bg-[#8A9A7B] text-white rounded-full hover:bg-[#6D7D5E] transition-all shadow-lg hover:shadow-xl font-bold"
        >
          ออกแบบเอง
        </button>

        <button
          onClick={onGoCatalog}
          className="flex-1 max-w-[240px] py-4 md:py-5 border-2 border-[#8A9A7B] text-[#8A9A7B] rounded-full hover:bg-[#8A9A7B] hover:text-white transition-all shadow-md font-bold bg-white/40 backdrop-blur-sm"
        >
          เลือกชุดที่มีอยู่
        </button>
      </div>
      {/* ================= Contact Section (New!) ================= */}
      <div className="mt-16 flex flex-col items-center gap-4 z-10 relative">
        <div className="flex items-center gap-6">
          <a href="https://www.instagram.com/flowersforyou24?igsh=bjhnems5enhwNTQ=" target="_blank" rel="noreferrer"
            className="text-[#8A9A7B] hover:text-[#5D6D4E] transition-transform hover:scale-110">
            <Instagram size={24} />
          </a>
          <a href="https://www.tiktok.com/@flowers_for_you_24?_r=1&_t=ZS-938iZpPXDC3" target="_blank" rel="noreferrer"
            className="text-[#8A9A7B] hover:text-[#5D6D4E] transition-transform hover:scale-110">
            {/* TikTok Icon (Using MessageCircle or a custom SVG) */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
          </a>

          <div className="relative flex flex-col items-center">
            {/* ข้อความแจ้งเตือนเมื่อคัดลอกสำเร็จ */}
            {copied && (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative bg-[#8A9A7B] text-white text-[11px] font-medium py-1.5 px-3 rounded-xl shadow-lg whitespace-nowrap">
        คัดลอกอีเมลแล้ว!
        {/* หางลูกศรชี้ลง */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#8A9A7B] rotate-45"></div>
      </div>
    </div>
  )}

            <button
              onClick={handleCopyEmail}
              className="text-[#8A9A7B] hover:text-[#5D6D4E] transition-transform hover:scale-110 flex items-center justify-center"
              title="Click to copy email"
            >
              <Mail size={24} />
            </button>
          </div>
        </div>
        <p className="text-[10px] tracking-[0.2em] text-[#8A9A7B] font-medium uppercase opacity-60">
          Get in touch with us
        </p>
      </div>
    </div>
  );
};

export default HomeView;
