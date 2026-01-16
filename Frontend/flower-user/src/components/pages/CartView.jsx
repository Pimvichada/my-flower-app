import { ShoppingCart, Flower, Edit2, Trash2, Eye, PlusCircle, Info } from 'lucide-react';
import { SHIPPING_FEE, COLOR_NAMES, RIBBON_COLOR_NAMES, RING_COLOR_NAMES } from '../../constants/index';
import { groupFlowers } from '../../utils/helpers';
const CartView = ({
  cart, onRemove, onEdit, onCheckout, onAddMore, onViewImage }) => (
  <div className="min-h-screen bg-[#FDFBF7] p-8">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-serif text-[#5D6D4E] mb-8 flex items-center gap-4">
        <ShoppingCart size={32} />
        ตะกร้าสินค้า
      </h2>
      {cart.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center border border-[#F0EAD6] shadow-sm">
          <p className="text-gray-400 italic mb-8 text-lg">
            ตะกร้าของคุณยังว่างอยู่นะ...
          </p>
          <button
            onClick={onAddMore}
            className="px-10 py-4 bg-[#8A9A7B] text-white rounded-full font-bold shadow-md active:scale-95 transition-all"
          >
            ไปเลือกดอกไม้กัน!
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div
                key={item.cartId}
                className="bg-white p-6 rounded-3xl border border-[#F0EAD6] flex flex-col sm:flex-row gap-6 shadow-sm group"
              >
                <div
                  className="w-36 aspect-[4/5] bg-[#F8F9F4] rounded-2xl flex items-center justify-center relative overflow-hidden border shrink-0 cursor-zoom-in"
                  onClick={() => item.snapshot && onViewImage(item.snapshot)}
                >
                  {item.snapshot ? (
                    <>
                      <img
                        src={item.snapshot}
                        alt="bouquet"
                        className="w-full h-auto object-contain"
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <Eye className="text-white" />
                      </div>
                    </>
                  ) : (
                    <Flower className="text-[#8A9A7B] opacity-30" size={40} />
                  )}
                </div>
                {/* รายละเอียด */}
                <div className="flex-1 text-[#5D6D4E]">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-bold">{item.name}</h4>
                    <div className="flex gap-2">
                      {item.type === 'custom' && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 hover:bg-gray-50 rounded-full"
                        >
                          <Edit2 size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => onRemove(item.cartId)}
                        className="p-2 text-red-300 hover:text-red-500"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  {/* 🌸 รายละเอียดดอกไม้ */}
                  {item.type === 'custom' && item.details?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase flex items-center gap-1">
                        <Info size={12} />
                        รายละเอียดช่อ:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {groupFlowers(item.details).map((g, i) => (
                          <span
                            key={i}
                            className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-600 border"
                          >
                            {g.name} ({COLOR_NAMES[g.color] || 'ไม่ระบุสี'}) x {g.count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* 🎀 อะไหล่ */}
                  {item.type === 'custom' && (item.ribbon || item.ring) && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">
                        อะไหล่ที่เลือก:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.ribbon && (
                          <span className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-600 border flex items-center gap-2">
                            โบว์: {RIBBON_COLOR_NAMES[item.ribbon] || 'ไม่ระบุสี'}
                            <span
                              className="w-4 h-4 rounded-md border"
                              style={{ backgroundColor: item.ribbon }}
                            />
                          </span>)}
                        {item.ring && (
                          <span className="bg-gray-50 px-3 py-1.5 rounded-full text-xs text-gray-600 border flex items-center gap-2">
                            โซ่: {RING_COLOR_NAMES[item.ring] || 'ไม่ระบุสี'}
                            <span
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: item.ring }}
                            />
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="mt-4 font-bold text-lg">
                    {item.price} บาท
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={onAddMore}
              className="w-full py-4 border-2 border-dashed border-[#8A9A7B]/40 text-[#8A9A7B] rounded-3xl font-bold hover:bg-[#8A9A7B]/5 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle size={20} />
              เลือกดอกไม้เพิ่ม
            </button>
          </div>
          <div className="space-y-6">
            <div className="bg-[#FEFAE0] p-8 rounded-3xl border border-[#F0EAD6] sticky top-24 shadow-sm text-[#5D6D4E]">
              <h3 className="font-bold text-xl mb-6 border-b pb-4 text-center">
                สรุปรายการชำระ
              </h3>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span>ราคารวมสินค้า</span>
                  <span className="font-bold">
                    {cart.reduce((s, i) => s + i.price, 0)} บาท
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span className="font-bold">{SHIPPING_FEE} บาท</span>
                </div>
              </div>
              <div className="flex justify-between text-2xl font-bold pt-4 border-t">
                <span>ยอดสุทธิ</span>
                <span>
                  {cart.reduce((s, i) => s + i.price, 0) + SHIPPING_FEE} บาท
                </span>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold mt-8 shadow-lg hover:bg-[#6D7D5E] transition-all active:scale-95"
              >
                ดำเนินการชำระเงิน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default CartView;
