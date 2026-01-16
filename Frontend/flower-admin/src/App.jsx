import React, { useState, useEffect } from "react";
import {
  Lock, Package, RefreshCw, Eye, Check, X, LogOut,
  CheckCircle, Flower, Truck, Calendar, MapPin, Download,Phone,Mail
} from "lucide-react";

// --- Helper สำหรับจัดการข้อมูลดอกไม้ (ยกมาจากไฟล์เดิมของคุณ) ---
const groupFlowers = (details) => {
  if (!details) return [];
  const counts = {};
  details.forEach((f) => {
    counts[f.name] = (counts[f.name] || 0) + 1;
  });
  return Object.keys(counts).map((name) => ({ name, count: counts[name] }));
};

/* =========================
   1. Login Component (เหมือนเดิม)
========================= */
const LoginView = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const ADMIN_PASSWORD = "admin123";
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-xl text-center border border-[#F0EAD6]">
        <div className="w-20 h-20 bg-[#F8F9F4] rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-[#8A9A7B]" size={32} />
        </div>
        <h2 className="text-2xl font-serif text-[#5D6D4E] mb-2 font-bold">Admin Access</h2>
        <form onSubmit={(e) => { e.preventDefault(); if (password === ADMIN_PASSWORD) onLogin(); else alert("รหัสผ่านไม่ถูกต้อง"); }}>
          <input type="password" placeholder="รหัสผ่านผู้ดูแลระบบ" className="w-full px-6 py-4 bg-[#F8F9F4] rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-[#8A9A7B] text-center" onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-lg hover:bg-[#748465] transition-all">เข้าสู่ระบบ</button>
        </form>
      </div>
    </div>
  );
};

/* =========================
   2. Dashboard Component
========================= */
const DashboardView = ({ onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchOrder, setSearchOrder] = useState("");
  
  // State สำหรับ Modal ใหม่
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://72.62.243.238:5000/api/orders", {
        headers: { "Content-Type": "application/json", "x-admin-key": "fl0w3rf0ry0ufl0w3rf0ry0u" },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการ ${status === "approved" ? "ยอมรับ" : "ปฏิเสธ"} ออเดอร์นี้`)) return;
    try {
      await fetch(`http://72.62.243.238:5000/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": "fl0w3rf0ry0ufl0w3rf0ry0u" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch { alert("เกิดข้อผิดพลาด"); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 font-serif font-bold text-[#5D6D4E] text-xl">
          <Package /> Admin Dashboard
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-red-400 font-bold text-sm hover:text-red-600">
          <LogOut size={18} /> ออกจากระบบ
        </button>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#5D6D4E]">รายการสั่งซื้อ</h1>
          <div className="flex gap-3">
            <input type="text" placeholder="ค้นหาเลข Order..." value={searchOrder} onChange={(e) => setSearchOrder(e.target.value)}
              className="px-5 py-3 w-64 bg-white rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#8A9A7B] outline-none" />
            <button onClick={fetchOrders} className="p-3 bg-white rounded-xl border border-gray-100 hover:bg-gray-50">
              <RefreshCw size={20} className={loading ? "animate-spin text-[#8A9A7B]" : "text-[#8A9A7B]"} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F8F9F4] text-[#8A9A7B] text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5">ออเดอร์</th>
                <th className="px-6 py-5">เวลา</th>
                <th className="px-6 py-5">ลูกค้า</th>
                <th className="px-6 py-5">ยอดโอน</th>
                <th className="px-6 py-5 text-center">จัดการ</th>
                <th className="px-6 py-5 text-center">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.filter(o => o.orderId.toLowerCase().includes(searchOrder.toLowerCase())).map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono font-bold text-sm">{order.orderId}</td>
                   <td className="px-6 py-4 text-sm text-gray-500">{order.orderTime ? new Date(order.orderTime).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-700">{order.customerInfo?.name}</div>
                    <div className="text-xs text-gray-400">{order.customerInfo?.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#5D6D4E]">฿{order.summary?.totalPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    {order.status === "pending" ? (
                      <div className="flex justify-center gap-2">
                        <button onClick={() => updateStatus(order.orderId, "approved")} className="p-2 bg-green-500 text-white rounded-lg"><Check size={16} /></button>
                        <button onClick={() => updateStatus(order.orderId, "rejected")} className="p-2 bg-red-500 text-white rounded-lg"><X size={16} /></button>
                      </div>
                    ) : (
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${order.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                      className="p-2 text-[#8A9A7B] hover:bg-[#F8F9F4] rounded-full transition-all"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =========================
           3. Order Details Modal (หน้าตา SuccessView)
        ========================= */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            
            <div className="relative bg-[#FDFBF7] rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-in zoom-in-95">
              
              {/* ปุ่มปิดมุมขวา */}
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-md z-10 text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>

              <div className="p-8 md:p-10">
                {/* Header เหมือน SuccessView */}
                <div className="text-center mb-8">
                  <div className={`mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center ${selectedOrder.status === 'approved' ? 'bg-green-100 text-green-500' : 'bg-orange-100 text-orange-500'}`}>
                    {selectedOrder.status === 'approved' ? <CheckCircle size={40} /> : <Package size={40} />}
                  </div>
                  <h2 className="text-2xl font-serif text-[#5D6D4E] font-bold">ข้อมูลคำสั่งซื้อ</h2>
                  <p className="text-gray-400 text-sm">สถานะปัจจุบัน: {selectedOrder.status}</p>
                </div>

                {/* ข้อมูลลูกค้า/หมายเลขสั่งซื้อ */}
                <div className="bg-white p-6 rounded-3xl mb-6 shadow-sm border border-[#F0EAD6]">
                  <div className="flex flex-col sm:flex-row justify-between border-b border-gray-100 pb-3 mb-3 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">หมายเลขสั่งซื้อ</span>
                      <span className="font-mono font-bold text-[#5D6D4E] text-lg">{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex flex-col sm:items-end text-right">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ผู้สั่งซื้อ</span>
                      <span className="font-bold text-gray-700">{selectedOrder.customerInfo?.name}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-xs text-gray-500">
                 <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-[#8A9A7B]" />
                      <span>วันที่สั่งซื้อ: {selectedOrder.orderTime ? new Date(selectedOrder.orderTime).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : '-'}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-[#8A9A7B] shrink-0" />
                      <span className="leading-tight">{selectedOrder.customerInfo?.address}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone size={14} className="text-[#8A9A7B] shrink-0" />
                      <span className="leading-tight">เบอร์ติดต่อ: {selectedOrder.customerInfo?.phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail size={14} className="text-[#8A9A7B] shrink-0" />
                      <span className="leading-tight">อีเมล์: {selectedOrder.customerInfo?.email}</span>
                    </div>
                  </div>
                </div>

                {/* รายการสินค้า */}
                <div className="space-y-4 mb-8">
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-[#8A9A7B] border-b pb-2">รายการที่สั่งซื้อ</h4>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-50">
                      <div className="w-20 aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                        {item.snapshot ? <img src={item.snapshot} className="w-full h-full object-cover" /> : <Flower className="m-auto mt-4 text-gray-200" />}
                      </div>
                      <div className="flex-1 py-1">
                        <div className="flex justify-between font-bold text-[#5D6D4E]">
                          <span className="text-sm">{item.name}</span>
                          <span className="text-sm">{item.price} ฿</span>
                        </div>
                        {item.type === "custom" && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {groupFlowers(item.details).map((g, i) => (
                              <span key={i} className="text-[9px] bg-[#F8F9F4] px-2 py-0.5 rounded-full text-[#8A9A7B] font-bold">
                                {g.name} x {g.count}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ยอดรวมสุทธิ */}
                <div className="bg-[#5D6D4E] text-white p-6 rounded-3xl mb-8 flex justify-between items-center shadow-lg">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest opacity-70 block">ยอดรวมสุทธิ</span>
                    <span className="text-xs opacity-80">(รวมค่าจัดส่ง ฿50)</span>
                  </div>
                  <span className="text-3xl font-bold">฿{selectedOrder.summary?.totalPrice.toLocaleString()}</span>
                </div>

                {/* หลักฐานการโอน (สลิป) - ส่วนที่เพิ่มพิเศษสำหรับ Admin */}
                <div className="space-y-3">
                  <h4 className="font-bold text-[10px] uppercase tracking-widest text-[#8A9A7B] text-center">หลักฐานการโอนเงิน</h4>
                  <div className="bg-white p-4 rounded-3xl border-2 border-dashed border-gray-200 flex justify-center">
                    <img 
                      src={`http://72.62.243.238:5000/${selectedOrder.slipPath}`} 
                      alt="Slip" 
                      className="max-w-full rounded-xl shadow-sm cursor-zoom-in"
                      onClick={() => window.open(`http://72.62.243.238:5000/${selectedOrder.slipPath}`)}
                    />
                  </div>
                  <p className="text-center text-[10px] text-gray-400 italic mt-2">คลิกที่รูปเพื่อดูขนาดใหญ่</p>
                </div>

                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full mt-8 py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold hover:bg-[#748465] transition-all shadow-md"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAdmin") === "true");
  const login = () => { setIsAuth(true); localStorage.setItem("isAdmin", "true"); };
  const logout = () => { setIsAuth(false); localStorage.removeItem("isAdmin"); };
  return isAuth ? <DashboardView onLogout={logout} /> : <LoginView onLogin={login} />;
}