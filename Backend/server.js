const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- 1. เชื่อมต่อ MongoDB ---
mongoose
  .connect("mongodb://localhost:27017/flower_shop")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Could not connect to MongoDB", err));

// --- 2. Schema และ Model ---
const orderSchema = new mongoose.Schema({
  orderId: String,
  orderTime: Date,
  customerInfo: Object,
  items: Array,
  summary: Object,
  slipPath: String,
  status: { type: String, default: "pending" },
});

const Order = mongoose.model("Order", orderSchema);

// --- 3. ตั้งค่า Nodemailer ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "flowerforyoushop.s@gmail.com",
    pass: "ttof dhtq bhwi redx", // App Password 16 หลัก
  },
});

// ฟังก์ชันสำหรับส่งอีเมล (Final Version)
const sendOrderStatusEmail = async (orderData, status) => {
  const isApproved = status === "approved";
  const shippingCost = 50;

  const mailOptions = {
    from: '"Flower For You 24" <flowerforyoushop.s@gmail.com>',
    to: orderData.customerInfo.email,
    subject: isApproved
      ? `Your flowers are coming! Order #${orderData.orderId}`
      : `Action Required: Order #${orderData.orderId} Payment Issue`,
    html: `
      <div style="font-family: 'Sarabun', Helvetica, Arial, sans-serif; line-height: 1.5; color: #444; max-width: 480px; margin: auto; border: 1px solid #f0f0f0; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        
        <div style="background-color: ${
          isApproved ? "#5D6D4E" : "#d32f2f"
        }; padding: 30px 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px; font-weight: 600;">
            ${isApproved ? "Confirmed! ✨" : "Payment Problem"}
          </h2>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 13px;">
            Order ID: ${orderData.orderId}
          </p>
        </div>

        <div style="padding: 24px; background-color: #ffffff;">
          <p style="margin: 0 0 12px; font-size: 16px; color: #333;">
            Hello <strong>${orderData.customerInfo.name}</strong>,
          </p>
          <p style="margin: 0 0 24px; font-size: 14px; color: #666; line-height: 1.6;">
            ${
              isApproved
                ? "Great news! Your payment has been verified. We're now carefully preparing your beautiful bouquet to ensure it arrives in perfect condition."
                : "We're sorry, but we couldn't verify your payment slip. Please check your transaction details and contact our support team to re-submit your proof of payment."
            }
          </p>

          <div style="background-color: #FBFBF9; border-radius: 16px; padding: 20px; border: 1px solid #F1F1EB;">
            <p style="margin: 0 0 15px; font-weight: bold; font-size: 12px; color: #8A9A7B; text-transform: uppercase; letter-spacing: 1px;">Order Summary</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              ${orderData.items
                .map(
                  (item) => `
                <tr>
                  <td style="padding-bottom: 12px; vertical-align: top;">
                    <div style="font-weight: 600; color: #333; font-size: 14px;">${
                      item.name
                    }</div>
                    ${
                      item.details && item.details.length > 0
                        ? `
                      <div style="font-size: 12px; color: #888; margin-top: 4px; line-height: 1.4;">
                        <span style="font-style: italic;">Flowers:</span> ${item.details
                          .map((f) => f.name)
                          .join(", ")}
                      </div>
                    `
                        : ""
                    }
                  </td>
                  <td style="padding-bottom: 12px; text-align: right; vertical-align: top; font-weight: 600; color: #444; font-size: 14px; white-space: nowrap;">
                    ฿${item.price.toLocaleString()}
                  </td>
                </tr>
              `
                )
                .join("")}

              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: #666; border-top: 1px solid #EAEAE2;">Shipping Fee</td>
                <td style="padding: 8px 0; text-align: right; font-size: 13px; color: #666; border-top: 1px solid #EAEAE2;">฿${shippingCost}</td>
              </tr>

              <tr>
                <td style="padding-top: 12px; font-weight: bold; color: #333; font-size: 15px;">Total Amount</td>
                <td style="padding-top: 12px; text-align: right; font-weight: 800; color: #5D6D4E; font-size: 18px;">
                  ฿${orderData.summary.totalPrice.toLocaleString()}
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 24px;">
            ${
              isApproved
                ? `
              <div style="border-left: 3px solid #E5E7EB; padding-left: 15px;">
                <p style="margin: 0; font-size: 13px; color: #444; font-weight: bold;">📍 Shipping To:</p>
                <p style="margin: 4px 0 0; font-size: 13px; color: #777; line-height: 1.4;">${orderData.customerInfo.address}</p>
              </div>
            `
                : `
              <div style="background-color: #FFF5F5; border-left: 4px solid #F87171; padding: 12px; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; color: #991B1B; line-height: 1.4;">
                  <strong>⚠️ What to do:</strong> Please re-check your transfer amount/time and contact us via chat for assistance.
                </p>
              </div>
            `
            }
          </div>

          <div style="margin-top: 35px; text-align: center; background: #F8F9F4; padding: 15px; border-radius: 12px;">
            <p style="margin: 0; font-size: 14px; color: #5D6D4E; font-style: italic;">
              "Flowers are like friends; they bring color to your world."
            </p>
            <p style="margin: 8px 0 0; font-weight: bold; color: #5D6D4E; font-size: 15px;">Thank you for choosing us! 🤍</p>
          </div>

          <div style="margin-top: 25px; text-align: center; border-top: 1px solid #F3F4F6; padding-top: 20px;">
            <p style="margin: 0; font-weight: bold; color: #5D6D4E; font-size: 14px;">Flower For You 24</p>
            <p style="margin: 4px 0 0; font-size: 11px; color: #BBB;">24/7 Service • Handcrafted with love</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `📧 Final email sent (${status}) to: ${orderData.customerInfo.email}`
    );
  } catch (error) {
    console.error("❌ Send email failed:", error);
  }
};

// --- 4. Multer & Routes (คงเดิม) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads/slips";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e3);
    cb(null, uniqueSuffix + ext);
  },
});
const upload = multer({ storage: storage });

app.post("/api/orders", upload.single("slip"), async (req, res) => {
  try {
    const orderData = JSON.parse(req.body.orderData);
    const newOrder = new Order({
      ...orderData,
      slipPath: req.file ? req.file.path.replace(/\\/g, "/") : null,
    });
    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order saved!", orderId: newOrder.orderId });
  } catch (error) {
    res.status(500).json({ message: "Error saving order" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderTime: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

app.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const currentOrder = await Order.findOne({ orderId: id });
    if (!currentOrder)
      return res.status(404).json({ message: "Order not found" });
    if (currentOrder.status !== "pending")
      return res.status(400).json({ message: "Order already processed" });

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: id },
      { status: status },
      { new: true }
    );
    if (updatedOrder) await sendOrderStatusEmail(updatedOrder, status);
    res.json({ message: `Status updated to ${status} and email sent.` });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
);
