const express = require("express");
const router = express.Router();
const Product = require("../../models/Product.model"); // ✅ Ensure correct model path

router.get("/", async (req, res) => {
  const query = req.query.query || req.query.q; // ✅ Check both `query` and `q`

  if (!query) {
    console.log("❌ No search query provided");
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    console.log("🔍 Received Search Query:", query);

    // Debugging: Fetch ALL products to see if they exist
    const allProducts = await Product.find({});
    console.log("🛒 All Products in DB:", allProducts.map(p => p.name));

    // Search for matching products (case-insensitive regex)
    const products = await Product.find({ name: new RegExp(query, "i") });

    console.log("✅ Matching Products:", products);

    if (!products.length) {
      console.log("❌ No products found matching:", query);
    }

    res.json(products.map((p) => ({
      id: p._id,
      title: p.name,
      image: p.image,  // ✅ Include image
      price: p.price,  // ✅ Include price
      url: `/products/${p._id}`,
      type: "Product"
    })));
    
  } catch (error) {
    console.error("❌ Error in search route:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
