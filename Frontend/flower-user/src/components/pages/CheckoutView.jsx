import {
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const CheckoutView = ({ customerInfo, setCustomerInfo, onNext }) => {
 
  const isValidFullName = (name) => {
    const value = name.trim();
    const nameRegex = /^[A-Za-zก-๙]+(\s+[A-Za-zก-๙]+)*$/;
    return value.length >= 2 && nameRegex.test(value);
  };

  const isValidThaiPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    return /^0\d{9}$/.test(cleaned);
  };

  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email.trim());
  };

  
  const isValidAddress = (address) => {
    const value = address.trim();
    const hasNumber = /\d/.test(value);
    const hasKeyword =
      /(ถ\.|ถนน|ซ\.|ซอย|ตำบล|แขวง|อำเภอ|เขต|จังหวัด|บ้านเลขที่)/.test(value);

    return value.length >= 15 && hasNumber && hasKeyword;
  };

  const fieldStatus = {
    name: isValidFullName(customerInfo.name),
    phone: isValidThaiPhone(customerInfo.phone),
    email: isValidEmail(customerInfo.email),
    address: isValidAddress(customerInfo.address),
  };

  const isValid =
    fieldStatus.name &&
    fieldStatus.phone &&
    fieldStatus.email &&
    fieldStatus.address;

 
  const fieldError = {
    name:
      customerInfo.name &&
      !fieldStatus.name &&
      "กรุณากรอกชื่อและนามสกุล ",

    phone:
      customerInfo.phone &&
      !fieldStatus.phone &&
      "กรุณากรอกเบอร์โทรที่ถูกต้อง",

    email:
      customerInfo.email &&
      !fieldStatus.email &&
      "รูปแบบอีเมลไม่ถูกต้อง",

    address:
      customerInfo.address &&
      !fieldStatus.address &&
      "กรุณากรอกที่อยู่ให้ครบ (บ้านเลขที่ / ถนน / เขต / จังหวัด)",
  };

 

  const InputIndicator = ({ isComplete, hasValue }) => {
    if (!hasValue) return null;
    return isComplete ? (
      <CheckCircle2 className="absolute right-4 top-4 text-green-500" size={18} />
    ) : (
      <AlertCircle
        className="absolute right-4 top-4 text-orange-400"
        size={18}
      />
    );
  };

  const ErrorText = ({ message }) => {
    if (!message) return null;
    return (
      <p className="mt-1 text-xs text-orange-500 flex items-center gap-1">
        <AlertCircle size={14} />
        {message}
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-10 rounded-3xl shadow-sm border border-[#F0EAD6]">
        <h2 className="text-3xl font-serif text-[#5D6D4E] mb-8 text-center underline decoration-dotted decoration-[#8A9A7B]">
          ข้อมูลผู้รับสินค้า
        </h2>

        <div className="space-y-6">
          
          <div>
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-300" size={20} />
              <input
                type="text"
                placeholder="ชื่อ-นามสกุล "
                className="w-full pl-12 pr-12 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 focus:ring-[#8A9A7B]"
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
            <ErrorText message={fieldError.name} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
            <div>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-4 text-gray-300"
                  size={20}
                />
                <input
                  type="tel"
                  placeholder="เบอร์โทรศัพท์"
                  className="w-full pl-12 pr-12 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 focus:ring-[#8A9A7B]"
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
              <ErrorText message={fieldError.phone} />
            </div>

            {/* อีเมล */}
            <div>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-4 text-gray-300"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="w-full pl-12 pr-12 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 focus:ring-[#8A9A7B]"
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
              <ErrorText message={fieldError.email} />
            </div>
          </div>

          {/* ที่อยู่ */}
          <div>
            <div className="relative">
              <MapPin
                className="absolute left-4 top-4 text-gray-300"
                size={20}
              />
              <textarea
                rows="4"
                placeholder="กรุณาระบุที่อยู่สําหรับการจัดส่ง"
                className="w-full pl-12 pr-12 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 focus:ring-[#8A9A7B]"
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    address: e.target.value,
                  })
                }
              />
              <div className="absolute right-4 top-4">
                <InputIndicator
                  isComplete={fieldStatus.address}
                  hasValue={customerInfo.address}
                />
              </div>
            </div>
            <ErrorText message={fieldError.address} />
          </div>

          <button
            onClick={() => {
              if (!isValid) return;
              onNext();
            }}
            disabled={!isValid}
            className="w-full py-5 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-md transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isValid ? "ต่อไป: ชำระเงิน" : "กรุณากรอกข้อมูลให้ถูกต้อง"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
