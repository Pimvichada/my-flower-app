const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// 1. เชื่อมต่อ MongoDB (เปลี่ยน URL เป็นของคุณเอง)
mongoose
  .connect("mongodb://localhost:27017/flower_shop")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// 2. ออกแบบ Schema (โครงสร้างข้อมูล)
const orderSchema = new mongoose.Schema({
  orderId: String,
  orderTime: Date,
  customerInfo: Object,
  items: Array,
  summary: Object,
  slipPath: String, // เก็บที่อยู่ไฟล์สลิป
  status: { type: String, default: "pending" },
});

const Order = mongoose.model("Order", orderSchema);
const nodemailer = require("nodemailer");

// ตั้งค่าตัวส่งอีเมล
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "flowerforyoushop.s@gmail.com", // อีเมลของร้าน
    pass: "ttof dhtq bhwi redx", // App Password 16 หลักจาก Google
  },
});

// ฟังก์ชันสำหรับส่งอีเมลยืนยัน
const sendConfirmEmail = async (orderData) => {
  const mailOptions = {
    from: '"Flower For You 24" <flowerforyoushop.s@gmail.com>',
    to: orderData.customerInfo.email, // อีเมลลูกค้าที่ดึงมาจากฐานข้อมูล
    subject: `ยืนยันคำสั่งซื้อเรียบร้อยแล้ว - เลขที่ ${orderData.orderId}`,
    html: `
      <div style="font-family: 'Sarabun', sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #5D6D4E;">สวัสดีคุณ ${
          orderData.customerInfo.name
        }</h2>
        <p>เราได้รับยอดชำระและยืนยันคำสั่งซื้อของคุณเรียบร้อยแล้ว!</p>
        <hr/>
        <p><strong>รายละเอียดการจัดส่ง:</strong></p>
        <p>${orderData.customerInfo.address}</p>
        <p><strong>รายการสินค้า:</strong></p>
        <ul>
          ${orderData.items
            .map((item) => `<li>${item.name} - ${item.price} บาท</li>`)
            .join("")}
        </ul>
        <p><strong>ยอดชำระรวม:</strong> ${orderData.summary.totalPrice} บาท</p>
        <hr/>
        <p>เราจะเริ่มจัดส่งดอกไม้ให้คุณโดยเร็วที่สุด ขอบคุณที่ไว้วางใจเราครับ</p>
        <p>จากทีมงาน <strong>Flower For You 24</strong></p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("ส่งอีเมลยืนยันสำเร็จ!");
  } catch (error) {
    console.error("ส่งอีเมลล้มเหลว:", error);
  }
};
// 3. ตั้งค่าการเก็บไฟล์รูปภาพสลิป
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/slips";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // ดึงนามสกุลไฟล์เดิมมา (เช่น .png, .jpg)
    const ext = path.extname(file.originalname);

    // สร้างชื่อไฟล์ใหม่เป็น: 1768286397732-452.png
    // (เวลาปัจจุบัน - สุ่มเลข 3 ตัวเพื่อให้ไม่ซ้ำกันแน่นอน)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e3);

    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// 4. API รับออเดอร์
app.post("/api/orders", upload.single("slip"), async (req, res) => {
  try {
    const orderData = JSON.parse(req.body.orderData);

    const newOrder = new Order({
      ...orderData,
      slipPath: req.file ? req.file.path : null,
    });

    await newOrder.save();
    console.log("บันทึกออเดอร์สำเร็จ:", newOrder.orderId);

    res
      .status(201)
      .json({ message: "Order saved!", orderId: newOrder.orderId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving order" });
  }
});

// 5. API สำหรับหน้า Admin ดึงข้อมูลออเดอร์ทั้งหมด
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find().sort({ orderTime: -1 });
  res.json(orders);
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(5000, () => console.log("Server running on port 5000"));

// API สำหรับดึงออเดอร์ทั้งหมด (ดึงล่าสุดขึ้นก่อน)
app.get("/api/orders", async (req, res) => {
  const orders = await Order.find().sort({ orderTime: -1 });
  res.json(orders);
});

// API สำหรับเปลี่ยนสถานะออเดอร์ (Approved / Rejected)
app.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1. อัปเดตสถานะใน MongoDB
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: id },
      { status: status },
      { new: true } // เพื่อให้คืนค่าข้อมูลออเดอร์ล่าสุดกลับมา
    );

    // 2. ถ้า Admin กดยอมรับ (approved) ให้ส่งอีเมล
    if (status === "approved" && updatedOrder) {
      await sendConfirmEmail(updatedOrder);
    }

    res.json({ message: "Status updated and email sent!" });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});
