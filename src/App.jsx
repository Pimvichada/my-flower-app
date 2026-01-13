import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import payment from './assets/payment.jpg';

import {
  ImageModal,
  HomeView,
  CatalogView,
  CustomizerView,
  CartView,
  CheckoutView,
  PaymentView,
  VerifyingView,
  SuccessView
} from './components';

import { 
  SHIPPING_FEE,
  RIBBON_COLORS,
  RING_COLORS,
  BASE_FLOWERS_COUNT
} from './constants/index';

import { generateCartId, groupFlowers } from './utils/helpers';



// --- Main App ---

const App = () => {
  const [step, setStep] = useState('home');
  const [cart, setCart] = useState([]);
  const [customFlowers, setCustomFlowers] = useState([]);
  const [selectedRibbon, setSelectedRibbon] = useState(RIBBON_COLORS[0]);
  const [selectedRing, setSelectedRing] = useState(RING_COLORS[0]);
  const [editingCartId, setEditingCartId] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', address: '', phone: '', email: '' });
  const [paymentSlip, setPaymentSlip] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [orderTime, setOrderTime] = useState('');
  const [activePreviewImage, setActivePreviewImage] = useState(null);

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0) + (cart.length > 0 ? SHIPPING_FEE : 0);

  const handleAddToCart = (item) => {
    if (editingCartId) {
      setCart(cart.map(c => c.cartId === editingCartId ? { ...item, cartId: editingCartId } : c));
      setEditingCartId(null);
    } else {
      setCart([...cart, { ...item, cartId: generateCartId() }]);
    }
    setStep('cart');
  };

  const resetOrder = () => {
    setCart([]);
    setCustomFlowers([]);
    setStep('home');
    setPaymentSlip(null);
    setCustomerInfo({ name: '', address: '', phone: '', email: '' });
  };

  const renderContent = () => {
    switch (step) {
      case 'home': return <HomeView onStartCustom={() => { setCustomFlowers([]); setEditingCartId(null); setStep('custom'); }} onGoCatalog={() => setStep('catalog')} />;
      case 'catalog': return <CatalogView onBack={() => setStep('home')} onAdd={handleAddToCart} />;
      case 'custom': return (
        <CustomizerView flowers={customFlowers} setFlowers={setCustomFlowers} ribbon={selectedRibbon} setRibbon={setSelectedRibbon} ring={selectedRing} setRing={setSelectedRing} onAdd={handleAddToCart} onBack={() => setStep(editingCartId ? 'cart' : 'home')} editingId={editingCartId} />
      );
      case 'cart': return (
        <CartView cart={cart} onAddMore={() => setStep('home')} onRemove={(id) => setCart(cart.filter(i => i.cartId !== id))} onEdit={(item) => { setCustomFlowers([...item.details]); setSelectedRibbon(item.ribbon); setSelectedRing(item.ring); setEditingCartId(item.cartId); setStep('custom'); }} onCheckout={() => setStep('checkout')} onViewImage={setActivePreviewImage} />
      );
      case 'checkout': return (
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
              <button onClick={() => setStep('payment')} disabled={!customerInfo.name || !customerInfo.address || !customerInfo.phone} className="w-full py-5 bg-[#8A9A7B] text-white rounded-2xl font-bold mt-4 shadow-md transition-all active:scale-95 disabled:bg-gray-200">ต่อไป: ชำระเงิน</button>
            </div>
          </div>
        </div>
      );
      case 'payment': return (
        <div className="min-h-screen bg-[#FDFBF7] p-8 flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-xl text-center border border-[#F0EAD6]">
            <h2 className="text-3xl font-serif text-[#5D6D4E] mb-2">ชำระเงิน</h2>
            <p className="text-3xl text-gray-400 mb-8 font-extrabold   decoration-[#5D6D4E]">ยอดชำระสุทธิ {totalPrice} บาท</p>
            <div className="bg-[#F8F9F4] p-6 rounded-3xl mb-8 flex justify-center border-4 border-[#5D6D4E]/10 shadow-inner">
               {/* <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=FlowerForYou24_Payment" alt="PromptPay" className="w-full h-full opacity-80" /> */}
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
              onClick={() => { 
                setStep('verifying'); 
                setOrderId('ORD-'+Math.random().toString(36).toUpperCase().substr(2, 8)); 
                setOrderTime(new Date().toLocaleString('th-TH', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }));
                setTimeout(() => setStep('success'), 2000); 
              }} 
              disabled={!paymentSlip} 
              className="w-full py-5 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-lg active:scale-95 disabled:bg-gray-200"
            >
              ยืนยันการชำระเงิน
            </button>
          </div>
        </div>
      );
      case 'verifying': return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-8 border-[#8A9A7B] border-t-transparent rounded-full animate-spin mb-8 shadow-sm"></div>
          <h2 className="text-2xl font-serif text-[#5D6D4E]">กำลังตรวจสอบข้อมูล...</h2>
        </div>
      );
      case 'success': return (
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
                  <div 
                    className="w-28 aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden relative shrink-0 border border-gray-100 cursor-zoom-in"
                    onClick={() => item.snapshot && setActivePreviewImage(item.snapshot)}
                  >
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
              <button onClick={() => window.print()} className="flex-1 py-4 border-2 border-[#8A9A7B] text-[#8A9A7B] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                <Download size={20}/> บันทึกใบเสร็จ (PDF) 
              </button>
              <button onClick={resetOrder} className="flex-1 py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-lg hover:bg-[#6D7D5E] transition-all active:scale-95">
                กลับหน้าหลัก
              </button>
            </div>
            
            <p className="mt-8 text-center text-[10px] text-gray-300 italic">ขอบคุณที่ให้โอกาส Flower For You 24 ได้ดูแลความรู้สึกของคุณ</p>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="font-sans text-gray-800 antialiased bg-[#FDFBF7] min-h-screen overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@400;700&family=Sarabun:wght@300;400;500;700&display=swap');
        body { font-family: 'Sarabun', sans-serif; }
        h1, h2, h3, h4, .font-serif { font-family: 'Noto Serif Thai', serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        @keyframes fade-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        @keyframes fall {
          0% { transform: translateY(-15vh) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(115vh) rotate(360deg); opacity: 0; }
        }
        
        @media print { .no-print { display: none !important; } }
      `}</style>
      
      {step !== 'home' && step !== 'success' && (
        <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center no-print">
          <div className="font-serif text-[#5D6D4E] text-2xl font-bold cursor-pointer" onClick={() => setStep('home')}>Flower For You 24</div>
          <button onClick={() => setStep('cart')} className="relative p-3 bg-gray-50 rounded-2xl text-gray-600 hover:text-[#8A9A7B] transition-all">
            <ShoppingCart size={24} />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#8A9A7B] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">{cart.length}</span>}
          </button>
        </nav>
      )}

      <main className={step !== 'home' && step !== 'success' ? 'pt-24 pb-12' : ''}>
        {renderContent()}
      </main>

      <ImageModal src={activePreviewImage} onClose={() => setActivePreviewImage(null)} />
    </div>
  );
};

export default App;
