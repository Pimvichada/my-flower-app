import {
  CheckCircle,
  Flower,
  Truck,
  Download,
  Calendar,
  MapPin,
  Camera,
} from "lucide-react";

import {
  BASE_FLOWERS_COUNT,
  COLOR_NAMES,
  SHIPPING_FEE,
  RIBBON_COLOR_NAMES,
  RING_COLOR_NAMES,
} from "../../constants/index";

import { groupFlowers } from "../../utils/helpers";

const SuccessView = ({
  orderId,
  orderTime,
  customerInfo,
  cart,
  totalPrice,
  onPrint,
  onReset,
}) => (
  <div className="min-h-screen bg-[#FDFBF7] p-8 print:p-0">
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-[#F0EAD6] shadow-xl print:shadow-none">

      {/* ===== Header ===== */}
      <div className="text-center mb-8">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
        <h2 className="text-3xl md:text-4xl font-serif text-[#5D6D4E]">
          ส่งคําสั่งชื้อสําเร็จ!
        </h2>
        <p className="text-gray-400 mt-2 font-medium text-sm">
          รอร้านอนุมัติคําสั่งชื้อ
        </p>
        <p className="text-gray-400 font-medium text-sm">
          ขอบคุณที่อุดหนุน Flower For You 24
        </p>
      </div>

      {/* ===== Screenshot Notice (Mobile) ===== */}
      <div className="lg:hidden mb-8 p-4 bg-[#FEFAE0]/50 border border-dashed border-[#8A9A7B]/30 rounded-2xl flex items-center gap-3">
        <div className="bg-[#8A9A7B] p-2 rounded-full text-white">
          <Camera size={18} />
        </div>
        <p className="text-[#5D6D4E] text-[11px] font-bold leading-tight">
          โปรดบันทึกภาพหน้าจอ (Screenshot) <br />
          เพื่อใช้เป็นหลักฐานการสั่งซื้อ
        </p>
      </div>

      {/* ===== Order Info ===== */}
      <div className="bg-[#F8F9F4] p-6 rounded-3xl mb-8 text-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between border-b pb-3 mb-3 gap-2">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              หมายเลขสั่งซื้อ
            </span>
            <div className="font-mono font-bold text-[#5D6D4E] text-lg">
              {orderId}
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              ชื่อผู้สั่งซื้อ
            </span>
            <div className="font-bold text-gray-700">
              {customerInfo.name}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar size={14} className="text-[#8A9A7B]" />
            วันที่สั่งซื้อ: {orderTime}
          </div>

          <div className="flex items-start gap-2 text-gray-500">
            <MapPin size={14} className="text-[#8A9A7B]" />
            {customerInfo.address}
          </div>
        </div>
      </div>

      {/* ===== Order Items ===== */}
      <div className="space-y-6 mb-8 text-[#5D6D4E]">
       <h4 className="font-bold text-xs uppercase tracking-[0.2em] border-b pb-2 mb-8">

          รายการที่สั่งซื้อ
        </h4>

        {cart.map((item) => (
          <div
            key={item.cartId}
          className="flex gap-4 pt-6 mb-6"


          >
            {/* Image */}
            <div className="w-24 md:w-28 aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden border">
              {item.snapshot ? (
                <img
                  src={item.snapshot}
                  alt="bouquet"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Flower className="m-auto mt-6" size={32} />
              )}
            </div>

            {/* Detail */}
            <div className="flex-1">
              <div className="flex justify-between font-bold">
                <span className="text-base">{item.name}</span>
                <span>{item.price} บาท</span>
              </div>

           {item.type === "custom" && (
  <div className="mt-2 space-y-2">

    {/* ดอกไม้ */}
    <div className="flex flex-wrap gap-1">
      {groupFlowers(item.details).map((g, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1
                     text-[9px] bg-gray-100 px-2 py-0.5
                     rounded-full font-bold text-gray-400"
        >
          {g.name} ({COLOR_NAMES[g.color] || "ไม่ระบุสี"}) × {g.count}
        </span>
      ))}

      {/* โบว์ */}
      {item.ribbon && (
        <span
          className="inline-flex items-center gap-1
                     text-[9px] bg-gray-100 px-2 py-0.5
                     rounded-full font-bold text-gray-400"
        >
          โบว์ {RIBBON_COLOR_NAMES[item.ribbon] || "ไม่ระบุสี"}
          <span
            className="w-2.5 h-2.5 rounded-sm border"
            style={{ backgroundColor: item.ribbon }}
          />
        </span>
      )}

      {/* โซ่ */}
      {item.ring && (
        <span
          className="inline-flex items-center gap-1
                     text-[9px] bg-gray-100 px-2 py-0.5
                     rounded-full font-bold text-gray-400"
        >
          โซ่ {RING_COLOR_NAMES[item.ring] || "ไม่ระบุสี"}
          <span
            className="w-2.5 h-2.5 rounded-full border"
            style={{ backgroundColor: item.ring }}
          />
        </span>
      )}
    </div>

  </div>
)}

              
            </div>
          </div>
        ))}

        <div className="border-t pt-6 space-y-3 text-sm">
          <div className="flex justify-between text-gray-500">
            <span className="flex items-center gap-2">
              <Truck size={16} /> ค่าจัดส่ง
            </span>
            <span>{SHIPPING_FEE} บาท</span>
          </div>

          <div className="flex justify-between text-xl font-bold pt-4 border-t border-dashed">
            <span className="opacity-60">ยอดรวมสุทธิ</span>
            <span className="underline decoration-double">
              {totalPrice} บาท
            </span>
          </div>
        </div>
      </div>

      {/* ===== Actions ===== */}
      <div className="flex flex-col lg:flex-row gap-4 print:hidden">
        <button
          onClick={onPrint}
          className="hidden lg:flex flex-1 py-4 border-2 border-[#8A9A7B] text-[#8A9A7B] rounded-2xl font-bold justify-center gap-2"
        >
          <Download size={20} /> บันทึกใบเสร็จ (PDF)
        </button>

        <button
          onClick={onReset}
          className="flex-1 py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold"
        >
          กลับหน้าหลัก
        </button>
      </div>

      <p className="mt-8 text-center text-[10px] text-gray-300 italic">
        ขอบคุณที่ให้โอกาส Flower For You 24 ได้ดูแลความรู้สึกของคุณ
      </p>
    </div>
  </div>
);

export default SuccessView;
