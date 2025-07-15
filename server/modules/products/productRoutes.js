const express = require("express");
const { verifyAdmin } = require("../../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../../models/Product.model"); // Ensure the model is imported

const router = express.Router();

console.log("✅ productRoutes.js is being executed!");

// ✅ Test Route (Keep for Debugging)
router.get("/test", (req, res) => {
    res.json({ message: "✅ Test route is working!" });
});

// ✅ Ensure "uploads" folder exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure Multer for Image Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

const productController = require("./product.controller");
console.log("🔍 Loaded Controller Methods:", Object.keys(productController));

const getProductById = productController.getProductById;
const createProduct = productController.createProduct;
const updateProduct = productController.updateProduct;
const deleteProduct = productController.deleteProduct;

// ✅ GET All Products (Supports Category & Subcategory Filters)
router.get("/", async (req, res) => {
    try {
        let query = {}; 

        if (req.query.category) {
            query.category = { $regex: new RegExp(`^${req.query.category.trim()}$`, "i") };
        }

        if (req.query.subcategory) {
            query.subcategory = { $regex: new RegExp(`^${req.query.subcategory.trim()}$`, "i") };
        }

        const products = await Product.find(query);
        if (!products.length) return res.status(404).json({ message: "No products found" });

        // ✅ Format image URLs correctly
        const formattedProducts = products.map(product => ({
            ...product._doc,
            image: product.image && !product.image.startsWith("http")
                ? `http://localhost:5000/uploads/${product.image}`
                : product.image,
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ GET Products by Category (Supports Subcategories)
router.get("/category/:category", async (req, res) => {
    try {
        const category = req.params.category.trim().toLowerCase();
        let query = { category };

        if (req.query.subcategory) {
            query.subcategory = { $regex: new RegExp(`^${req.query.subcategory.trim()}$`, "i") };
        }

        const products = await Product.find(query);
        if (!products.length) return res.status(404).json({ message: "No products found in this category" });

        res.json(products.map(product => ({
            ...product._doc,
            image: product.image ? `http://localhost:5000/uploads/${product.image}` : null,
        })));
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ GET Single Product by ID
router.get("/:id", getProductById);

// ✅ Protected Routes (Admin Only)
router.post("/", verifyAdmin, upload.single("image"), createProduct);
router.put("/:id", verifyAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyAdmin, deleteProduct);

console.log("✅ Product routes are being registered");

// ✅ Log the registered routes
console.log("📂 Registered Product Routes:", router.stack.map(r => r.route?.path).filter(Boolean));
console.log("📂 Final Registered Routes in Express:");
router.stack.forEach((layer) => {
    if (layer.route) {
        console.log(`➡️ ${Object.keys(layer.route.methods).join(", ").toUpperCase()} ${layer.route.path}`);
    }
});


module.exports = router;
