import React, { useState, useEffect } from "react";
import {
  Lock,
  Package,
  RefreshCw,
  Eye,
  Check,
  X,
  LogOut,
  Search,
} from "lucide-react";

// --- 1. หน้า Login Component ---
const LoginView = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const ADMIN_PASSWORD = "admin123"; // 👈 เปลี่ยนรหัสผ่านที่นี่

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

// --- 2. หน้า Dashboard Component ---
const DashboardView = ({ onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    if (
      !confirm(
        `คุณแน่ใจนะว่าต้องการ ${
          status === "approved" ? "ยอมรับ" : "ปฏิเสธ"
        } ออเดอร์นี้?`
      )
    )
      return;
    await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
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
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#5D6D4E]">
              รายการสั่งซื้อ
            </h1>
            <p className="text-gray-400">
              ตรวจสอบและยืนยันการชำระเงินจากลูกค้า
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
          >
            <RefreshCw
              size={20}
              className={
                loading ? "animate-spin text-[#8A9A7B]" : "text-[#8A9A7B]"
              }
            />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#F8F9F4] text-[#8A9A7B] text-xs font-bold uppercase">
              <tr>
                <th className="px-6 py-5">ออเดอร์</th>
                <th className="px-6 py-5">ลูกค้า</th>
                <th className="px-6 py-5">ยอดโอน</th>
                <th className="px-6 py-5">หลักฐาน</th>
                <th className="px-6 py-5">สถานะ</th>
                <th className="px-6 py-5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-[#5D6D4E]">
                      {order.orderId}
                    </span>
                    <div className="text-[10px] text-gray-400 uppercase">
                      {new Date(order.orderTime).toLocaleString("th-TH")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-700">
                      {order.customerInfo?.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.customerInfo?.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#5D6D4E]">
                    ฿{order.summary?.totalPrice}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        window.open(`http://localhost:5000/${order.slipPath}`)
                      }
                      className="flex items-center gap-1 text-xs font-bold text-[#8A9A7B] hover:underline"
                    >
                      <Eye size={14} /> ดูสลิป
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : order.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => updateStatus(order.orderId, "approved")}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => updateStatus(order.orderId, "rejected")}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

// --- 3. Main App ---
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
