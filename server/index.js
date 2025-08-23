const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// ✅ Load environment variables
dotenv.config();
const { MONGO_URI, JWT_SECRET } = process.env;
const PORT = process.env.PORT || 5000;

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
    origin: [
      "http://localhost:5173",
      "https://starlinkcenter.com.np",
      "https://www.starlinkcenter.com.np",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ✅ Request Logger
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// ✅ Health Check Endpoint for Render
app.get("/api/v1/auth/test", (req, res) => {
  res.status(200).json({ message: "✅ Auth API working" });
});

// ✅ Ensure uploads folder
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
const orderRoutes = require("./routes/orderRoutes");
const imageRoutes = require("./routes/imageRoutes");

// ✅ Register Routes
const routeMappings = {
  "/api/v1/auth": authRoutes,
  "/api/v1/admin": adminRoutes,
  "/api/v1/products": productRoutes,
  "/api/v1/search": searchRoutes,
  "/api/v1/contact": contactRoutes,
  "/api/v1/users": userRoutes,
  "/api/v1/orders": orderRoutes,
  "/api/v1/images": imageRoutes,
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

// ✅ Connect to MongoDB
console.log("🔍 [DB] Connecting to MongoDB...");
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    console.log("🔍 DB Name:", mongoose.connection.db.databaseName);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📚 Collections:", collections.map(c => c.name));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    setTimeout(() => process.exit(1), 5000);
  });

// ✅ Handle 404
app.use("*", (req, res) =>
  res.status(404).json({ error: "API Route Not Found" })
);

// ✅ Start the Server
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
