import { 
  CheckCircle, 
  Flower, 
  Edit2, 
  Truck, 
  PlusCircle,
  Download,
  Calendar,
  MapPin
} from 'lucide-react';
import { BASE_FLOWERS_COUNT, SHIPPING_FEE } from '../../constants/index';
import { groupFlowers } from '../../utils/helpers';

const SuccessView = ({ 
  orderId, 
  orderTime, 
  customerInfo, 
  cart, 
  totalPrice, 
  onPrint, 
  onReset 
}) => (
  <div className="min-h-screen bg-[#FDFBF7] p-8 print:p-0">
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] border border-[#F0EAD6] shadow-xl print:shadow-none">
      <div className="text-center mb-8">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
        <h2 className="text-4xl font-serif text-[#5D6D4E]">สั่งซื้อสำเร็จ!</h2>
        <p className="text-gray-400 mt-2 font-medium">ขอบคุณที่อุดหนุน Flower For You 24</p>
      </div>
      
      {/* Receipt Header / Meta Info */}
      <div className="bg-[#F8F9F4] p-6 rounded-3xl mb-8 text-sm border border-gray-100">
         <div className="flex flex-col sm:flex-row justify-between border-b border-gray-200 pb-3 mb-3 gap-2">
           <div className="flex flex-col">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">หมายเลขสั่งซื้อ</span>
             <span className="font-mono font-bold text-[#5D6D4E] text-lg">{orderId}</span>
           </div>
           <div className="flex flex-col sm:items-end">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ชื่อผู้สั่งซื้อ</span>
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

      <div className="space-y-6 mb-8 text-[#5D6D4E]">
        <h4 className="font-bold text-xs uppercase tracking-[0.2em] border-b pb-2 border-gray-50">รายการที่สั่งซื้อ</h4>
        {cart.map(item => (
          <div key={item.cartId} className="flex gap-4 border-t pt-6 first:border-none group">
            <div className="w-28 aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden relative shrink-0 border border-gray-100">
              {item.snapshot ? (
                <img src={item.snapshot} alt="Item" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              ) : <Flower className="m-auto mt-6" size={32} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between font-bold">
                <span className="text-lg">{item.name}</span>
                <span className="text-gray-800">{item.price} บาท</span>
              </div>
              {item.type === 'custom' && (
                <div className="mt-2 space-y-1">
                  <div className="flex flex-wrap gap-1">
                    {groupFlowers(item.details).map((g, i) => <span key={i} className="text-[9px] bg-gray-100 px-2 py-0.5 rounded-full font-bold text-gray-400 uppercase tracking-tighter">{g.name} x {g.count}</span>)}
                  </div>
                  {item.details.length > BASE_FLOWERS_COUNT && <div className="text-[10px] font-bold text-[#8A9A7B] flex items-center gap-1"><PlusCircle size={10}/> เพิ่มดอกไม้พิเศษ {item.details.length - BASE_FLOWERS_COUNT} ดอก</div>}
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="border-t pt-6 space-y-3 text-sm border-gray-100">
          <div className="flex justify-between text-gray-500 font-medium">
            <span className="flex items-center gap-2"><Truck size={16}/> ค่าจัดส่ง (Standard Delivery)</span>
            <span>{SHIPPING_FEE} บาท</span>
          </div>
          <div className="flex justify-between items-center text-2xl font-bold text-[#5D6D4E] pt-4 border-t border-dashed border-gray-200">
            <span className="text-lg uppercase tracking-wider opacity-60">ยอดรวมสุทธิ</span>
            <span className="underline decoration-double underline-offset-8 decoration-[#8A9A7B]">{totalPrice} บาท</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 print:hidden">
        <button onClick={onPrint} className="flex-1 py-4 border-2 border-[#8A9A7B] text-[#8A9A7B] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
          <Download size={20}/> บันทึกใบเสร็จ (PDF) 
        </button>
        <button onClick={onReset} className="flex-1 py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-lg hover:bg-[#6D7D5E] transition-all active:scale-95">
          กลับหน้าหลัก
        </button>
      </div>
      
      <p className="mt-8 text-center text-[10px] text-gray-300 italic">ขอบคุณที่ให้โอกาส Flower For You 24 ได้ดูแลความรู้สึกของคุณ</p>
    </div>
  </div>
);

export default SuccessView;
