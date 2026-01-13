import { ImageIcon } from 'lucide-react';
import payment from '../../assets/payment.jpg';

const PaymentView = ({ totalPrice, paymentSlip, setPaymentSlip, onConfirm, isLoading }) => (
  <div className="min-h-screen bg-[#FDFBF7] p-8 flex items-center justify-center">
    <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-xl text-center border border-[#F0EAD6]">
      <h2 className="text-3xl font-serif text-[#5D6D4E] mb-2">ชำระเงิน</h2>
      <p className="text-3xl text-gray-400 mb-8 font-extrabold decoration-[#5D6D4E]">ยอดชำระสุทธิ {totalPrice} บาท</p>
      <div className="bg-[#F8F9F4] p-6 rounded-3xl mb-8 flex justify-center border-4 border-[#5D6D4E]/10 shadow-inner">
         <img src={payment} alt="payment" className="w-full h-full opacity-80 rounded-lg" />
      </div>
      <div className="mb-8 text-left">
         <div className="relative border-2 border-dashed border-[#8A9A7B]/30 rounded-2xl p-8 cursor-pointer hover:bg-[#F8F9F4] transition-all">
           <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setPaymentSlip(e.target.files[0])} />
           <div className="flex flex-col items-center text-[#8A9A7B]">
             <ImageIcon size={48} className="mb-2" />
             <span className="text-xs font-bold uppercase">{paymentSlip ? paymentSlip.name : 'แนบหลักฐานการโอน'}</span>
           </div>
         </div>
      </div>
      <button 
        onClick={onConfirm}
        disabled={!paymentSlip || isLoading} 
        className="w-full py-5 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-lg active:scale-95 disabled:bg-gray-200"
      >
        {isLoading ? 'กำลังตรวจสอบ...' : 'ยืนยันการชำระเงิน'}
      </button>
    </div>
  </div>
);

export default PaymentView;
