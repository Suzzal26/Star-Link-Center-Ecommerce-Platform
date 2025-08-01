const Product = require("../../models/Product.model"); // Ensure this path is correct

console.log("🔍 Checking Product model import...");
console.log(Product); // This should NOT be undefined

// ✅ Get all products (Supports Category & Subcategory Filters)
const getAllProducts = async (req, res) => {
    try {
        let query = {};

        if (req.query.category) {
            query.category = { 
                $regex: new RegExp(`^${req.query.category.trim()}$`, "i") 
            };
        }

        if (req.query.subcategory) {
            query.subcategory = { 
                $regex: new RegExp(`^${req.query.subcategory.trim()}$`, "i") 
            };
        }

        const products = await Product.find(query);

        if (!products.length) {
            return res.status(404).json({ message: "No products found" });
        }

        res.json(products.map(product => ({
            ...product._doc,
            image: product.image ? `http://localhost:5000/uploads/${product.image}` : null,
        })));
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

        res.json({
            ...product._doc,
            image: product.image ? `http://localhost:5000/uploads/${product.image}` : null
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
};

// ✅ Utility function to extract numeric price
const extractNumericPrice = (price) => {
    if (typeof price === 'string') {
        return parseFloat(price.replace(/[^0-9.]/g, ''));
    }
    return price;
};

// ✅ Create Product
const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, subcategory, stock } = req.body;

        if (!name || !price || !description || !category) {
            return res.status(400).json({ error: "All required fields (name, price, description, category) must be filled" });
        }

        // ✅ Normalize category & subcategory
        const formattedCategory = category.trim().toLowerCase();
        const formattedSubcategory = subcategory ? subcategory.trim() : null;

        const product = new Product({
            name,
            price: extractNumericPrice(price),
            description,
            category: formattedCategory,
            subcategory: formattedSubcategory,
            stock: stock || 0,
            image: req.file ? req.file.filename : null,
        });

        await product.save();
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

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(400).json({ error: "Failed to update product" });
    }
};

// ✅ Delete Product
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: "Product not found" });

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
    deleteProduct
};
