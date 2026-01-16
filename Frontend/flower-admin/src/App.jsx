import React, { useState, useEffect } from "react";
import {
  Lock, Package, RefreshCw, Eye, Check, X, LogOut,
} from "lucide-react";

const LoginView = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const ADMIN_PASSWORD = "admin123";

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-xl text-center border border-[#F0EAD6]">
        <div className="w-20 h-20 bg-[#F8F9F4] rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-[#8A9A7B]" size={32} />
        </div>

        <h2 className="text-2xl font-serif text-[#5D6D4E] mb-2 font-bold">
          Admin Access
        </h2>
        <p className="text-gray-400 text-sm mb-8">
          จัดการระบบหลังบ้าน Flower For You 24
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === ADMIN_PASSWORD) onLogin();
            else alert("รหัสผ่านไม่ถูกต้อง");
          }}
        >
          <input
            type="password"
            placeholder="รหัสผ่านผู้ดูแลระบบ"
            className="w-full px-6 py-4 bg-[#F8F9F4] rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-[#8A9A7B] text-center"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-4 bg-[#8A9A7B] text-white rounded-2xl font-bold shadow-lg hover:bg-[#748465] transition-all">
            เข้าสู่ระบบ
          </button>
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

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://72.62.243.238:5000/api/orders", {
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": "fl0w3rf0ry0ufl0w3rf0ry0u",
        },
      });

      if (res.status === 401) {
        alert("คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    if (
      !confirm(
        `คุณแน่ใจหรือไม่ว่าต้องการ ${status === "approved" ? "ยอมรับ" : "ปฏิเสธ"
        } ออเดอร์นี้`
      )
    )
      return;
    try {
      await fetch(
        `http://72.62.243.238:5000/api/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": "fl0w3rf0ry0ufl0w3rf0ry0u",
          },
          body: JSON.stringify({ status }),
        }
      );
      fetchOrders();
    } catch {
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 font-serif font-bold text-[#5D6D4E] text-xl">
          <Package /> Admin Dashboard
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-red-400 font-bold text-sm hover:text-red-600"
        >
          <LogOut size={18} /> ออกจากระบบ
        </button>
      </nav>
      <main className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#5D6D4E]">
              รายการสั่งซื้อ
            </h1>
            <p className="text-gray-400 mt-1">
              ตรวจสอบและยืนยันการชำระเงินจากลูกค้า
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="ค้นหาเลข Order..."
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              className="px-5 py-3 w-64 bg-[#F8F9F4] rounded-xl border border-gray-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#8A9A7B]"
            />

            <button
              onClick={fetchOrders}
              className="p-3 bg-white rounded-xl shadow-sm border border-gray-100
                         hover:bg-gray-50 transition-all active:scale-95"
            >
              <RefreshCw
                size={20}
                className={
                  loading
                    ? "animate-spin text-[#8A9A7B]"
                    : "text-[#8A9A7B]"
                }
              />
            </button>
          </div>
        </div>
        {/* Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F8F9F4] text-[#8A9A7B] text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-5 text-center">จัดการ</th>
                  <th className="px-6 py-5">ออเดอร์</th>
                  <th className="px-6 py-5">ลูกค้า</th>
                  <th className="px-6 py-5">ยอดโอน</th>
                  <th className="px-6 py-5">หลักฐาน</th>
                  <th className="px-6 py-5 text-center">สถานะ</th>
                  <th className="px-6 py-5 text-center">จัดการ</th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {orders
                  .filter((o) =>
                    o.orderId
                      .toLowerCase()
                      .includes(searchOrder.toLowerCase())
                  )
                  .map((order) => (
                    <tr key={order.orderId}>
                      <td className="px-6 py-4 font-mono font-bold">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4">
                        {order.customerInfo?.name}
                        <div className="text-xs text-gray-400">
                          {order.customerInfo?.phone}
                        </div>
                        {/* --- ส่วนแสดงรูปภาพ Snapshot --- */}

                        <div className="mt-2">
                          {order.items && order.items.map((item, idx) => (
                            item.snapshot ? (
                              <div key={idx} className="inline-block mr-2 text-center">
                                <div className="w-16 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                                  <img
                                    src={item.snapshot}
                                    alt="bouquet"
                                    className="w-full h-full object-cover cursor-zoom-in"
                                    onClick={() => {
                                      // 1. เปิดหน้าต่างใหม่ที่เป็นหน้าว่างก่อน
                                      const newWindow = window.open();

                                      // 2. ตรวจสอบว่าหน้าต่างถูกเปิดสำเร็จ (ไม่โดน Pop-up blocker กั้น)
                                      if (newWindow) {
                                        newWindow.document.write(`
        <html>
          <head>
            <title>Bouquet Preview - ${item.name || 'Flower'}</title>
            <style>
              body { margin: 0; background: #1a1a1a; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
              img { max-width: 90%; max-height: 90vh; box-shadow: 0 0 30px rgba(0,0,0,0.5); border-radius: 8px; }
            </style>
          </head>
          <body>
            <img src="${item.snapshot}" />
          </body>
        </html>
      `);
                                        newWindow.document.close(); // ปิดการเขียนเพื่อความสมบูรณ์ของหน้าเว็บ
                                      } else {
                                        alert("กรุณาอนุญาตให้เปิด Pop-up บนเบราว์เซอร์ของคุณ");
                                      }
                                    }}
                                  />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">{item.name}</p>
                              </div>
                            ) : null
                          ))}</div>
                      </td>
                      <td className="px-6 py-4 font-bold">
                        ฿
                        {order.summary?.totalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            window.open(
                              `http://72.62.243.238:5000/${order.slipPath}`
                            )
                          }
                          className="flex items-center gap-1 text-sm text-[#8A9A7B] underline"
                        >
                          <Eye size={14} /> ดูสลิป
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {order.status}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {order.status === "pending" ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() =>
                                updateStatus(
                                  order.orderId,
                                  "approved"
                                )
                              }
                              className="p-2 bg-green-500 text-white rounded"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(
                                  order.orderId,
                                  "rejected"
                                )
                              }
                              className="p-2 bg-red-500 text-white rounded"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">
                            Done
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && !loading && (
            <div className="p-20 text-center text-gray-300">
              ไม่พบข้อมูลคำสั่งซื้อ
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default function App() {
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("isAdmin") === "true"
  );

  const login = () => {
    setIsAuth(true);
    localStorage.setItem("isAdmin", "true");
  };

  const logout = () => {
    setIsAuth(false);
    localStorage.removeItem("isAdmin");
  };

  return isAuth ? (
    <DashboardView onLogout={logout} />
  ) : (
    <LoginView onLogin={login} />
  );
}
