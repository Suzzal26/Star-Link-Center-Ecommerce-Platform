const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// ✅ Load environment variables
dotenv.config();
const { MONGO_URI, JWT_SECRET, PORT = 5000 } = process.env;

// ✅ Validate required environment variables
if (!MONGO_URI || !JWT_SECRET) {
  console.error("❌ MONGO_URI and JWT_SECRET must be defined in .env file.");
  process.exit(1);
}

// ✅ Initialize Express app
const app = express();

// ✅ Middleware Setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Ensure `uploads/` folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));
console.log("✅ Static file serving enabled for '/uploads'");

// ✅ Import Routes
const authRoutes = require("./modules/auth/authRoutes");
const adminRoutes = require("./modules/admin/adminRoutes");
const productRoutes = require("./modules/products/productRoutes");
const searchRoutes = require("./modules/search/searchRoutes");
const contactRoutes = require("./modules/contact/contactRoutes");
const userRoutes = require("./modules/users/user.route");

// ✅ 🆕 Import Order Routes (this is the only change)
const orderRoutes = require("./routes/orderRoutes");

// ✅ Validate and Register Routes
const routeMappings = {
  "/api/v1/auth": authRoutes,
  "/api/v1/admin": adminRoutes,
  "/api/v1/products": productRoutes,
  "/api/v1/search": searchRoutes,
  "/api/v1/contact": contactRoutes,
  "/api/v1/users": userRoutes,
  "/api/v1/orders": orderRoutes, // 🆕 Register order routes here
};

for (const [route, handler] of Object.entries(routeMappings)) {
  if (!handler || typeof handler !== "function") {
    console.error(`❌ Invalid route handler for ${route}`);
    process.exit(1);
  }
  app.use(route, handler);
}

// ✅ Debug Registered Routes
console.log("🛠 Registered API Routes:");
app._router.stack.forEach((layer) => {
  if (layer.route) {
    console.log(
      `➡️ ${Object.keys(layer.route.methods).join(", ").toUpperCase()} ${layer.route.path}`
    );
  }
});

// ✅ MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    setTimeout(() => process.exit(1), 5000);
  });

// ✅ Handle Undefined Routes
app.use("*", (req, res) =>
  res.status(404).json({ error: "API Route Not Found" })
);

// ✅ Start the Server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
