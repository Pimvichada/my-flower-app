import {
  CheckCircle,
  Flower,
  Truck,
  PlusCircle,
  Download,
  Calendar,
  MapPin,
  Camera,
} from "lucide-react";
import { BASE_FLOWERS_COUNT, SHIPPING_FEE } from "../../constants/index";
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
      {/* ส่วนหัวแสดงสถานะสำเร็จ */}
      <div className="text-center mb-8">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
        <h2 className="text-3xl md:text-4xl font-serif text-[#5D6D4E]">
          ส่งคําสั่งชื้อสําเร็จ!
        </h2>
        <p className="text-gray-400 mt-2 font-medium text-sm md:text-base">
          ขอบคุณที่อุดหนุน Flower For You 24
        </p>
      </div>

      {/* 📸 กล่องแจ้งเตือนสำหรับมือถือและ iPad (ซ่อนบนจอ Desktop 1024px ขึ้นไป) */}
      <div className="lg:hidden mb-8 p-4 bg-[#FEFAE0]/50 border border-dashed border-[#8A9A7B]/30 rounded-2xl flex items-center gap-3 animate-fade-in">
        <div className="bg-[#8A9A7B] p-2 rounded-full text-white shrink-0">
          <Camera size={18} />
        </div>
        <p className="text-[#5D6D4E] text-[11px] md:text-xs font-bold leading-tight">
          โปรดบันทึกภาพหน้าจอ (Screenshot) <br className="hidden md:block" />{" "}
          เพื่อใช้เป็นหลักฐานการสั่งซื้อ
        </p>
      </div>

      {/* ข้อมูลรายละเอียดคำสั่งซื้อ */}
      <div className="bg-[#F8F9F4] p-6 rounded-3xl mb-8 text-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between border-b border-gray-200 pb-3 mb-3 gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              หมายเลขสั่งซื้อ
            </span>
            <span className="font-mono font-bold text-[#5D6D4E] text-lg">
              {orderId}
            </span>
          </div>
          <div className="flex flex-col sm:items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              ชื่อผู้สั่งซื้อ
            </span>
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

      {/* รายการสินค้าที่สั่ง */}
      <div className="space-y-6 mb-8 text-[#5D6D4E]">
        <h4 className="font-bold text-xs uppercase tracking-[0.2em] border-b pb-2 border-gray-50">
          รายการที่สั่งซื้อ
        </h4>
        {cart.map((item) => (
          <div
            key={item.cartId}
            className="flex gap-4 border-t pt-6 first:border-none group"
          >
            <div className="w-24 md:w-28 aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden relative shrink-0 border border-gray-100">
              {item.snapshot ? (
                <img
                  src={item.snapshot}
                  alt="Item"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Flower className="m-auto mt-6" size={32} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between font-bold">
                <span className="text-base md:text-lg">{item.name}</span>
                <span className="text-[#5D6D4E]">{item.price} บาท</span>
              </div>
              {item.type === "custom" && (
                <div className="mt-2 space-y-1">
                  <div className="flex flex-wrap gap-1">
                    {groupFlowers(item.details).map((g, i) => (
                      <span
                        key={i}
                        className="text-[9px] bg-gray-100 px-2 py-0.5 rounded-full font-bold text-gray-400 uppercase tracking-tighter"
                      >
                        {g.name} x {g.count}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* สรุปยอดเงิน */}
        <div className="border-t pt-6 space-y-3 text-sm border-gray-100">
          <div className="flex justify-between text-gray-500 font-medium">
            <span className="flex items-center gap-2">
              <Truck size={16} /> ค่าจัดส่ง (Standard Delivery)
            </span>
            <span>{SHIPPING_FEE} บาท</span>
          </div>
          <div className="flex justify-between items-center text-xl md:text-2xl font-bold text-[#5D6D4E] pt-4 border-t border-dashed border-gray-200">
            <span className="text-sm md:text-lg uppercase tracking-wider opacity-60">
              ยอดรวมสุทธิ
            </span>
            <span className="underline decoration-double underline-offset-8 decoration-[#8A9A7B]">
              {totalPrice} บาท
            </span>
          </div>
        </div>
      </div>

      {/* ปุ่มดำเนินการ */}
      <div className="flex flex-col lg:flex-row gap-4 print:hidden">
        {/* ปุ่มบันทึกใบเสร็จ: แสดงเฉพาะ Desktop (1024px ขึ้นไป) */}
        <button
          onClick={onPrint}
          className="hidden lg:flex flex-1 py-4 border-2 border-[#8A9A7B] text-[#8A9A7B] rounded-2xl font-bold items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
        >
          <Download size={20} /> บันทึกใบเสร็จ (PDF)
        </button>

        <button
          onClick={onReset}
          className="flex-1 py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-lg hover:bg-[#6D7D5E] transition-all active:scale-95"
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
