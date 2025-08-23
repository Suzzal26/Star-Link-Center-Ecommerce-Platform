// ✅ Cloudinary-based Product Controller
const Product = require("../../models/Product.model");
const cloudinary = require("cloudinary").v2;

console.log("🔍 Checking Product model import...");
console.log(Product);

// ✅ Helper: Get Base URL
const getBaseUrl = (req) => {
  const isProduction = process.env.NODE_ENV === 'production' || 
    req.get('host')?.includes('onrender.com') ||
    req.get('host')?.includes('starlinkcenter.com.np');
  if (isProduction) {
    return process.env.BASE_URL || 'https://www.starlinkcenter.com.np';
  }
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
  const host = req.get('host') || 'localhost:5000';
  return `${protocol}://${host}`;
};

// ✅ Numeric Price Parser
const extractNumericPrice = (price) => {
  if (typeof price === "string") {
    return parseFloat(price.replace(/[^0-9.]/g, ""));
  }
  return price;
};

// ✅ Get Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({
      ...product._doc,
      image: product.image?.startsWith("http")
        ? product.image
        : `${getBaseUrl(req)}/api/v1/images/${product.image || 'placeholder'}`,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// ✅ Create Product (Cloudinary)
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, subcategory, stock } = req.body;
    if (!name || !price || !description || !category) {
      return res.status(400).json({
        error: "All required fields (name, price, description, category) must be filled",
      });
    }

    const imageUrl = req.file?.path || null; // Cloudinary URL

    const product = new Product({
      name,
      price: extractNumericPrice(price),
      description,
      category: category.trim().toLowerCase(),
      subcategory: subcategory?.trim() || null,
      stock: stock || 0,
      image: imageUrl,
    });

    await product.save();
    console.log('✅ Product created successfully:', product._id);
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update Product (Cloudinary)
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, subcategory, stock } = req.body;
    let updateData = {};

    if (name) updateData.name = name;
    if (price) updateData.price = extractNumericPrice(price);
    if (description) updateData.description = description;
    if (category) updateData.category = category.trim().toLowerCase();
    if (subcategory) updateData.subcategory = subcategory.trim();
    if (stock !== undefined) updateData.stock = stock;
    if (req.file) updateData.image = req.file.path; // Cloudinary URL

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ error: "Product not found" });

    console.log('✅ Product updated successfully:', updatedProduct._id);
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({ error: "Failed to update product" });
  }
};

// ✅ Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Optionally delete image from Cloudinary (if storing public_id)
    // Skipped for now unless you're saving Cloudinary public_id in DB

    await Product.findByIdAndDelete(req.params.id);
    console.log('✅ Product deleted successfully:', req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

module.exports = {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};