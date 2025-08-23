const express = require("express");
const { verifyAdmin } = require("../../middleware/authMiddleware");
const { upload } = require("../../utils/cloudinary"); // ✅ Replaces GridFS upload
const Product = require("../../models/Product.model");

const router = express.Router();

console.log("✅ productRoutes.js is being executed!");

// ✅ Controller methods
const productController = require("./product.controller");
console.log("🔍 Loaded Controller Methods:", Object.keys(productController));

const getProductById = productController.getProductById;
const createProduct = productController.createProduct;
const updateProduct = productController.updateProduct;
const deleteProduct = productController.deleteProduct;

// ✅ Test Route
router.get("/test", (req, res) => {
  res.json({ message: "✅ Test route is working!" });
});

// ✅ GET All Products
router.get("/", async (req, res) => {
  console.log("🔍 GET /api/v1/products - Request received!");
  console.log("📝 Request URL:", req.url);
  console.log("📝 Request method:", req.method);
  console.log("📝 Request headers:", req.headers);

  try {
    let query = {};

    if (req.query.category) {
      query.category = {
        $regex: new RegExp(`^${req.query.category.trim()}$`, "i"),
      };
    }

    if (req.query.subcategory) {
      query.subcategory = {
        $regex: new RegExp(`^${req.query.subcategory.trim()}$`, "i"),
      };
    }

    console.log("🔍 Query:", query);
    const products = await Product.find(query);
    console.log("🔍 Found products:", products.length);

    if (!products.length) {
      console.log("❌ No products found, returning 404");
      return res.status(404).json({ message: "No products found" });
    }

    const getBaseUrl = () => {
      const isProduction = process.env.NODE_ENV === 'production' || 
        req.get('host')?.includes('onrender.com') ||
        req.get('host')?.includes('starlinkcenter.com.np') ||
        req.get('host')?.includes('api.starlinkcenter.com.np');

      if (isProduction) {
        return process.env.BASE_URL || 'https://www.starlinkcenter.com.np';
      }

      const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
      const host = req.get('host') || 'localhost:5000';
      return `${protocol}://${host}`;
    };

    const baseUrl = getBaseUrl();

    const formattedProducts = products.map((product) => ({
      ...product._doc,
      image: product.image?.startsWith("http")
        ? product.image // Cloudinary URL
        : `${baseUrl}/api/v1/images/${product.image || 'placeholder'}`,
    }));

    console.log("✅ Returning products:", formattedProducts.length);
    res.json(formattedProducts);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET Products by Category
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category.trim().toLowerCase();
    let query = { category };

    if (req.query.subcategory) {
      query.subcategory = {
        $regex: new RegExp(`^${req.query.subcategory.trim()}$`, "i"),
      };
    }

    const products = await Product.find(query);
    if (!products.length)
      return res
        .status(404)
        .json({ message: "No products found in this category" });

    const getBaseUrl = () => {
      const isProduction = process.env.NODE_ENV === 'production' || 
        req.get('host')?.includes('onrender.com') ||
        req.get('host')?.includes('starlinkcenter.com.np') ||
        req.get('host')?.includes('api.starlinkcenter.com.np');

      if (isProduction) {
        return process.env.BASE_URL || 'https://www.starlinkcenter.com.np';
      }

      const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
      const host = req.get('host') || 'localhost:5000';
      return `${protocol}://${host}`;
    };

    const baseUrl = getBaseUrl();

    const formattedProducts = products.map((product) => ({
      ...product._doc,
      image: product.image?.startsWith("http")
        ? product.image
        : `${baseUrl}/api/v1/images/${product.image || 'placeholder'}`,
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ GET Single Product by ID
router.get("/:id", getProductById);

// ✅ Protected CRUD Routes (Admin Only)
router.post("/", verifyAdmin, upload.single("image"), createProduct);
router.put("/:id", verifyAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

// ✅ Log all routes
console.log("📂 Final Registered Routes in Express:");
router.stack.forEach((layer) => {
  if (layer.route) {
    console.log(
      `➡️ ${Object.keys(layer.route.methods).join(", ").toUpperCase()} ${
        layer.route.path
      }`
    );
  }
});

module.exports = router;
