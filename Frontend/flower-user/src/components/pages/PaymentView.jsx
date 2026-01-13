import { ImageIcon, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react"; // แก้ไข: นำเข้าแบบ Named Export { QRCodeSVG }
import generatePayload from "promptpay-qr";

const PaymentView = ({
  totalPrice,
  paymentSlip,
  setPaymentSlip,
  onConfirm,
  isLoading,
}) => {
  // 1. กำหนดหมายเลขพร้อมเพย์ (ควรใช้เบอร์ที่ผูกพร้อมเพย์จริง)
  const MY_PROMPTPAY_ID = "0612271094";

  // 2. สร้าง Payload สำหรับ QR Code
  const qrPayload = generatePayload(MY_PROMPTPAY_ID, { amount: totalPrice });

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-xl text-center border border-[#F0EAD6]">
        <h2 className="text-3xl font-serif text-[#5D6D4E] mb-2">ชำระเงิน</h2>

        <div className="mb-6">
          <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">
            ยอดชำระสุทธิ
          </p>
          <p className="text-4xl text-[#5D6D4E] font-black">฿{totalPrice}</p>
        </div>

        {/* ส่วนแสดง QR Code */}
        <div className="bg-[#F8F9F4] p-6 rounded-3xl mb-8 flex flex-col items-center border-4 border-[#5D6D4E]/10 shadow-inner">
          <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
            {/* แก้ไข: เปลี่ยนจาก <QRCode /> เป็น <QRCodeSVG /> */}
            <QRCodeSVG
              value={qrPayload}
              size={200}
              marginSize={2} // QRCodeSVG ใช้ marginSize แทน includeMargin ในบางเวอร์ชัน
            />
          </div>
          <div className="text-[#5D6D4E] font-bold text-sm">
            <p>สแกนผ่านแอปธนาคารเพื่อชำระเงิน</p>
            <p className="text-[10px] opacity-60 font-normal mt-1">
              ชื่อบัญชี: (ชื่อ-นามสกุล พิมวิ)
            </p>
          </div>
        </div>

        <div className="mb-8 text-left">
          <label className="text-[10px] font-bold text-gray-400 mb-2 block uppercase ml-2">
            แนบหลักฐานการโอน
          </label>
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all ${
              paymentSlip
                ? "border-green-500 bg-green-50"
                : "border-[#8A9A7B]/30 hover:bg-[#F8F9F4]"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPaymentSlip(e.target.files[0]);
                }
              }}
            />
            <div className="flex flex-col items-center">
              {paymentSlip ? (
                <div className="text-green-600 flex flex-col items-center text-center">
                  <CheckCircle2 size={48} className="mb-2" />
                  <span className="text-xs font-bold truncate max-w-[200px]">
                    {paymentSlip.name}
                  </span>
                  <span className="text-[10px] opacity-60 mt-1">
                    คลิกเพื่อเปลี่ยนรูป
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-[#8A9A7B]">
                  <ImageIcon size={48} className="mb-2" />
                  <span className="text-xs font-bold uppercase">
                    อัปโหลดสลิปที่นี่
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onConfirm}
          disabled={!paymentSlip || isLoading}
          className="w-full py-5 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-lg active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 transition-all"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>กำลังส่งข้อมูล...</span>
            </div>
          ) : (
            "ยืนยันการชำระเงิน"
          )}
        </button>

        <p className="mt-6 text-[10px] text-gray-300 italic">
          * ระบบจะตรวจสอบยอดเงินและยืนยันออเดอร์ให้คุณโดยเร็วที่สุด
        </p>
      </div>
    </div>
  );
};

export default PaymentView;
