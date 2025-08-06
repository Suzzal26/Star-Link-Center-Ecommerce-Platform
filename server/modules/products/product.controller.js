const Product = require("../../models/Product.model");
const { uploadToGridFS, deleteFromGridFS } = require("../../services/gridfsService");

console.log("🔍 Checking Product model import...");
console.log(Product);

// Helper function to get the base URL for the current environment
const getBaseUrl = (req) => {
  // Check for production environment or specific production domains
  const isProduction = process.env.NODE_ENV === 'production' || 
                      req.get('host')?.includes('onrender.com') ||
                      req.get('host')?.includes('starlinkcenter.com.np') ||
                      req.get('host')?.includes('api.starlinkcenter.com.np');
  
  if (isProduction) {
    // Use environment variable or default to your production domain
    return process.env.BASE_URL || 'https://www.starlinkcenter.com.np';
  }
  
  // In development, use the request host with proper protocol detection
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
  const host = req.get('host') || 'localhost:5000';
  return `${protocol}://${host}`;
};

// ✅ Get all products (Supports Category & Subcategory Filters)
const getAllProducts = async (req, res) => {
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

    const products = await Product.find(query);

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    const baseUrl = getBaseUrl(req);
    
    res.json(
      products.map((product) => ({
        ...product._doc,
        image: product.image
          ? `${baseUrl}/api/v1/images/${product.image}`
          : `${baseUrl}/api/v1/images/placeholder`,
      }))
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ✅ Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const baseUrl = getBaseUrl(req);

    res.json({
      ...product._doc,
      image: product.image
        ? `${baseUrl}/api/v1/images/${product.image}`
        : `${baseUrl}/api/v1/images/placeholder`,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// ✅ Utility function to extract numeric price
const extractNumericPrice = (price) => {
  if (typeof price === "string") {
    return parseFloat(price.replace(/[^0-9.]/g, ""));
  }
  return price;
};

// ✅ Create Product
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, subcategory, stock } = req.body;

    if (!name || !price || !description || !category) {
      return res
        .status(400)
        .json({
          error:
            "All required fields (name, price, description, category) must be filled",
        });
    }

    // ✅ Normalize category & subcategory (convert frontend capitalized to backend lowercase)
    const formattedCategory = category.trim().toLowerCase();
    const formattedSubcategory = subcategory ? subcategory.trim() : null;

    let imageId = null;
    
    // Handle image upload to GridFS
    if (req.file) {
      try {
        console.log('🖼️ Processing image upload for new product:', req.file.originalname);
        const uploadedFile = await uploadToGridFS(req.file);
        imageId = uploadedFile._id;
        console.log('✅ Image uploaded to GridFS:', uploadedFile._id);
      } catch (uploadError) {
        console.error('❌ Error uploading image:', uploadError);
        return res.status(500).json({ 
          error: 'Failed to upload image',
          details: uploadError.message 
        });
      }
    }

    const product = new Product({
      name,
      price: extractNumericPrice(price),
      description,
      category: formattedCategory,
      subcategory: formattedSubcategory,
      stock: stock || 0,
      image: imageId,
    });

    await product.save();
    console.log('✅ Product created successfully:', product._id);
    
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update Product
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

    // Handle image upload
    if (req.file) {
      try {
        console.log('🖼️ Processing image upload:', req.file.originalname);
        
        // Find the existing product to get the old image ID
        const existingProduct = await Product.findById(req.params.id);
        
        // Upload new image to GridFS
        const uploadedFile = await uploadToGridFS(req.file);
        updateData.image = uploadedFile._id;
        
        // Delete old image if it exists
        if (existingProduct && existingProduct.image) {
          try {
            await deleteFromGridFS(existingProduct.image);
            console.log('✅ Old image deleted from GridFS');
          } catch (deleteError) {
            console.warn('⚠️ Could not delete old image:', deleteError);
          }
        }
        
        console.log('✅ New image uploaded to GridFS:', uploadedFile._id);
      } catch (uploadError) {
        console.error('❌ Error uploading image:', uploadError);
        return res.status(500).json({ 
          error: 'Failed to upload image',
          details: uploadError.message 
        });
      }
    }

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

    // Delete image from GridFS if it exists
    if (product.image) {
      try {
        await deleteFromGridFS(product.image);
        console.log('✅ Image deleted from GridFS');
      } catch (deleteError) {
        console.warn('⚠️ Could not delete image from GridFS:', deleteError);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    
    console.log('✅ Product deleted successfully:', req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// ✅ Export all functions properly
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};