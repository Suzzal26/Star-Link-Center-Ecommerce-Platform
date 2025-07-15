const router = require("express").Router();
const mongoose = require("mongoose");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const User = require("../modules/users/user.model");
const { verifyToken } = require("../middleware/authMiddleware");
const {
  sendOrderConfirmationEmail,
  sendOrderDeliveredEmail,
  sendOrderCancelledEmail,
} = require("../utils/emailService");

/* ---------------------------------------------------------------------- */
/* 🛒 POST /api/v1/orders – Place Order (COD)                             */
/* ---------------------------------------------------------------------- */
router.post("/", verifyToken, async (req, res) => {
  console.log("🧾 Received Order Request:", req.body);

  try {
    const { items: rawItems, shippingAddress, totalAmount } = req.body;

    const items = rawItems.map((item) => ({
      ...item,
      productId: new mongoose.Types.ObjectId(item.productId),
    }));

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          error: `Not enough stock for "${item.name}". Available: ${
            product?.stock || 0
          }`,
        });
      }
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
      },
      totalAmount,
      paymentMethod: "COD",
      isVerified: true,
      status: "pending",
    });

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    res
      .status(201)
      .json({ message: "Order placed successfully", orderId: order._id });
  } catch (err) {
    console.error("❌ Order creation failed:", err.message);
    res.status(400).json({ error: err.message });
  }
});

/* 📜 GET /api/v1/orders – Admin: View All Orders                         */

router.get("/", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Fetching orders failed:", err.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/* 👤 GET /api/v1/orders/my-orders – User: View Own Orders                */

router.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch your orders" });
  }
});

/* ---------------------------------------------------------------------- */
/* ❌ PATCH /api/v1/orders/:id/cancel – User Cancels Order                */
/* ---------------------------------------------------------------------- */
router.patch("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Only pending orders can be cancelled." });
    }

    order.status = "cancelled";
    order.cancelReason = req.body.reason || "No reason provided";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("❌ Cancel order failed:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/* ✅ PATCH /api/v1/orders/:id – Admin Updates Order Status               */

router.patch("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { status } = req.body;

  if (!["confirmed", "cancelled", "delivered"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId", "email name"); // ✅ Fetch user email

    if (!order) return res.status(404).json({ error: "Order not found" });

    // ✅ Send email on confirmation
    if (status === "confirmed" && order.userId?.email) {
      try {
        await sendOrderConfirmationEmail(
          order.userId.email,
          order._id.toString()
        );
        console.log("📧 Confirmation email sent to", order.userId.email);
      } catch (mailErr) {
        console.error("❌ Failed to send confirmation email:", mailErr.message);
      }
    }

    if (status === "delivered" && order.userId?.email) {
      try {
        await sendOrderDeliveredEmail(order.userId.email, order._id.toString());
        console.log("📦 Delivery email sent to", order.userId.email);
      } catch (mailErr) {
        console.error("❌ Failed to send delivery email:", mailErr.message);
      }
    }

    if (status === "cancelled" && order.userId?.email) {
      try {
        await sendOrderCancelledEmail(order.userId.email, order._id.toString());
        console.log("📪 Cancelled email sent to", order.userId.email);
      } catch (mailErr) {
        console.error("❌ Failed to send cancelled email:", mailErr.message);
      }
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("❌ Failed to update order:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------------------------------------------------- */
/* 📊 GET /api/v1/orders/sales – Admin: Monthly Sales Summary            */
/* ---------------------------------------------------------------------- */
router.get("/sales", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

  try {
    const weeklySales = await Order.aggregate([
      { $match: { status: "delivered", createdAt: { $gte: oneMonthAgo } } },
      {
        $group: {
          _id: { $isoWeek: "$createdAt" },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const deliveredProducts = await Order.find({ status: "delivered" })
      .select("items createdAt userId")
      .populate("userId", "name email");

    res.json({ weeklySales, deliveredProducts });
  } catch (error) {
    console.error("❌ Sales fetch failed:", error);
    res.status(500).json({ error: "Could not fetch sales data" });
  }
});

module.exports = router;
