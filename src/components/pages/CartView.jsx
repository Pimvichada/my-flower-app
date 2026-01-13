import { 
  ShoppingCart, 
  Flower, 
  Edit2, 
  Trash2, 
  Eye, 
  PlusCircle 
} from 'lucide-react';
import { SHIPPING_FEE } from '../../constants/index';
import { groupFlowers } from '../../utils/helpers';

const CartView = ({ cart, onRemove, onEdit, onCheckout, onAddMore, onViewImage }) => (
  <div className="min-h-screen bg-[#FDFBF7] p-8">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-serif text-[#5D6D4E] mb-8 flex items-center gap-4"><ShoppingCart size={32} /> ตะกร้าสินค้า</h2>
      {cart.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center border border-[#F0EAD6] shadow-sm">
          <p className="text-gray-400 italic mb-8 text-lg">ตะกร้าของคุณยังว่างอยู่นะ...</p>
          <button onClick={onAddMore} className="px-10 py-4 bg-[#8A9A7B] text-white rounded-full font-bold shadow-md active:scale-95 transition-all">ไปเลือกดอกไม้กัน!</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.cartId} className="bg-white p-6 rounded-3xl border border-[#F0EAD6] flex flex-col sm:flex-row gap-6 shadow-sm group">
                <div 
                  className="w-36 aspect-[4/5] bg-[#F8F9F4] rounded-2xl flex items-center justify-center relative overflow-hidden border border-gray-100 shrink-0 cursor-zoom-in"
                  onClick={() => item.snapshot && onViewImage(item.snapshot)}
                >
                  {item.snapshot ? (
                    <>
                      <img src={item.snapshot} alt="Arrangement" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                        <Eye className="text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </>
                  ) : (
                    <Flower className="text-[#8A9A7B] opacity-30" size={40} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start text-[#5D6D4E]">
                    <h4 className="text-xl font-bold">{item.name}</h4>
                    <div className="flex gap-2">
                      {item.type === 'custom' && <button onClick={() => onEdit(item)} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Edit2 size={20}/></button>}
                      <button onClick={() => onRemove(item.cartId)} className="p-2 text-red-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                    </div>
                  </div>
                  {item.type === 'custom' && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {groupFlowers(item.details).map((g, i) => <span key={i} className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-bold text-gray-500">{g.name} x {g.count}</span>)}
                    </div>
                  )}
                  <div className="mt-4 font-bold text-[#5D6D4E] text-lg">{item.price} บาท</div>
                </div>
              </div>
            ))}
            <button onClick={onAddMore} className="w-full py-4 border-2 border-dashed border-[#8A9A7B]/40 text-[#8A9A7B] rounded-3xl font-bold hover:bg-[#8A9A7B]/5 transition-all flex items-center justify-center gap-2"><PlusCircle size={20} /> เลือกดอกไม้เพิ่ม</button>
          </div>
          <div className="space-y-6">
            <div className="bg-[#FEFAE0] p-8 rounded-3xl border border-[#F0EAD6] sticky top-24 shadow-sm text-[#5D6D4E]">
              <h3 className="font-bold text-xl mb-6 border-b border-[#5D6D4E]/10 pb-4 text-center">สรุปรายการชำระ</h3>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between"><span>ราคารวมสินค้า</span><span className="font-bold">{cart.reduce((s, i) => s + i.price, 0)} บาท</span></div>
                <div className="flex justify-between"><span>ค่าจัดส่ง</span><span className="font-bold">{SHIPPING_FEE} บาท</span></div>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-4 border-t border-[#5D6D4E]/20"><span>ยอดสุทธิ</span><span>{cart.reduce((s, i) => s + i.price, 0) + SHIPPING_FEE} บาท</span></div>
              <button onClick={onCheckout} className="w-full py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold mt-8 shadow-lg hover:bg-[#6D7D5E] transition-all active:scale-95">ดำเนินการชำระเงิน</button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default CartView;
