import { User, Phone, Mail, MapPin } from 'lucide-react';

const CheckoutView = ({ customerInfo, setCustomerInfo, onNext, isValid }) => (
  <div className="min-h-screen bg-[#FDFBF7] p-8 flex items-center justify-center">
    <div className="max-w-xl w-full bg-white p-10 rounded-3xl shadow-sm border border-[#F0EAD6]">
      <h2 className="text-3xl font-serif text-[#5D6D4E] mb-8 text-center underline decoration-dotted decoration-[#8A9A7B]">ข้อมูลผู้รับสินค้า</h2>
      <div className="space-y-4">
        <div className="relative">
           <User className="absolute left-4 top-4 text-gray-300" size={20} />
           <input type="text" placeholder="ชื่อ-นามสกุล" className="w-full pl-12 pr-4 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 focus:ring-[#8A9A7B] transition-all" value={customerInfo.name} onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Phone className="absolute left-4 top-4 text-gray-300" size={20} />
            <input type="tel" placeholder="เบอร์โทรศัพท์" className="w-full pl-12 pr-4 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 focus:ring-[#8A9A7B] transition-all" value={customerInfo.phone} onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})} />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-300" size={20} />
            <input type="email" placeholder="อีเมล" className="w-full pl-12 pr-4 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 focus:ring-[#8A9A7B] transition-all" value={customerInfo.email} onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})} />
          </div>
        </div>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 text-gray-300" size={20} />
          <textarea placeholder="ที่อยู่จัดส่งโดยละเอียด" rows="4" className="w-full px-4 py-4 bg-[#F8F9F4] rounded-2xl outline-none focus:ring-2 focus:ring-[#8A9A7B] transition-all" value={customerInfo.address} onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} />
        </div>
        <button onClick={onNext} disabled={!isValid} className="w-full py-5 bg-[#8A9A7B] text-white rounded-2xl font-bold mt-4 shadow-md transition-all active:scale-95 disabled:bg-gray-200">ต่อไป: ชำระเงิน</button>
      </div>
    </div>
  </div>
);

export default CheckoutView;
