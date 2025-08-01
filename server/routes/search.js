const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Blog = require("../models/Blog");

router.get("/", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const products = await Product.find({ name: new RegExp(q, "i") }).limit(5);
    const blogs = await Blog.find({ title: new RegExp(q, "i") }).limit(5);
    const staticPages = [
      { title: "Contact Us", url: "/contact", type: "Page" },
      { title: "About Us", url: "/about", type: "Page" },
    ];

    res.json([
      ...products.map((p) => ({ id: p._id, title: p.name, url: `/products/${p._id}`, type: "Product" })),
      ...blogs.map((b) => ({ id: b._id, title: b.title, url: `/blogs/${b._id}`, type: "Blog" })),
      ...staticPages.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())),
    ]);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
