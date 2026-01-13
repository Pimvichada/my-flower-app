import {
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const CheckoutView = ({ customerInfo, setCustomerInfo, onNext, isValid }) => {
  // ฟังก์ชันช่วยเช็คความถูกต้องเบื้องต้นรายช่อง
  const fieldStatus = {
    name: customerInfo.name.trim().length >= 3,
    phone: /^[0-9]{9,10}$/.test(customerInfo.phone.replace(/-/g, "")),
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email),
    address: customerInfo.address.trim().length >= 10,
  };

  const InputIndicator = ({ isComplete, hasValue }) => {
    if (!hasValue) return null;
    return isComplete ? (
      <CheckCircle2
        className="absolute right-4 top-4 text-green-500"
        size={18}
      />
    ) : (
      <AlertCircle
        className="absolute right-4 top-4 text-orange-400"
        size={18}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-10 rounded-3xl shadow-sm border border-[#F0EAD6]">
        <h2 className="text-3xl font-serif text-[#5D6D4E] mb-8 text-center underline decoration-dotted decoration-[#8A9A7B]">
          ข้อมูลผู้รับสินค้า
        </h2>

        <div className="space-y-6">
          {/* ชื่อ-นามสกุล */}
          <div className="relative">
            <User className="absolute left-4 top-4 text-gray-300" size={20} />
            <input
              type="text"
              placeholder="ชื่อ-นามสกุล (อย่างน้อย 3 ตัวอักษร)"
              className={`w-full pl-12 pr-12 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 transition-all ${
                customerInfo.name && !fieldStatus.name
                  ? "focus:ring-orange-300"
                  : "focus:ring-[#8A9A7B]"
              }`}
              value={customerInfo.name}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, name: e.target.value })
              }
            />
            <InputIndicator
              isComplete={fieldStatus.name}
              hasValue={customerInfo.name}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* เบอร์โทรศัพท์ */}
            <div className="relative">
              <Phone
                className="absolute left-4 top-4 text-gray-300"
                size={20}
              />
              <input
                type="tel"
                placeholder="เบอร์โทรศัพท์"
                className={`w-full pl-12 pr-12 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 transition-all ${
                  customerInfo.phone && !fieldStatus.phone
                    ? "focus:ring-orange-300"
                    : "focus:ring-[#8A9A7B]"
                }`}
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
              />
              <InputIndicator
                isComplete={fieldStatus.phone}
                hasValue={customerInfo.phone}
              />
            </div>

            {/* อีเมล */}
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-300" size={20} />
              <input
                type="email"
                placeholder="อีเมล"
                className={`w-full pl-12 pr-12 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 transition-all ${
                  customerInfo.email && !fieldStatus.email
                    ? "focus:ring-orange-300"
                    : "focus:ring-[#8A9A7B]"
                }`}
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, email: e.target.value })
                }
              />
              <InputIndicator
                isComplete={fieldStatus.email}
                hasValue={customerInfo.email}
              />
            </div>
          </div>

          {/* ที่อยู่ */}
          <div className="relative">
            <MapPin className="absolute left-4 top-4 text-gray-300" size={20} />
            <textarea
              placeholder="ที่อยู่จัดส่งโดยละเอียด (บ้านเลขที่, ซอย, ถนน, ตำบล)"
              rows="4"
              className={`w-full pl-12 pr-12 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 transition-all ${
                customerInfo.address && !fieldStatus.address
                  ? "focus:ring-orange-300"
                  : "focus:ring-[#8A9A7B]"
              }`}
              value={customerInfo.address}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, address: e.target.value })
              }
            />
            <div className="absolute right-4 top-4">
              <InputIndicator
                isComplete={fieldStatus.address}
                hasValue={customerInfo.address}
              />
            </div>
          </div>

          <div className="bg-[#FEFAE0]/50 p-4 rounded-2xl border border-dashed border-[#8A9A7B]/30">
            <p className="text-[11px] text-[#5D6D4E] font-medium leading-relaxed">
              * โปรดตรวจสอบความถูกต้องของที่อยู่และเบอร์โทรศัพท์
              เพื่อความรวดเร็วในการจัดส่งดอกไม้ถึงมือคุณ
            </p>
          </div>

          <button
            onClick={onNext}
            disabled={!isValid}
            className="w-full py-5 bg-[#8A9A7B] text-white rounded-2xl font-bold mt-4 shadow-md transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isValid ? "ต่อไป: ชำระเงิน" : "กรุณากรอกข้อมูลให้ครบถ้วน"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
