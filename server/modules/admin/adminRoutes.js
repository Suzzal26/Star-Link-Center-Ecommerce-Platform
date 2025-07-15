const express = require("express");
const { verifyAdmin } = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/dashboard", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

module.exports = router;
