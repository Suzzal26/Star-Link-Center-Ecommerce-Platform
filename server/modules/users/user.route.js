const express = require("express");
const router = express.Router();
const UserController = require("./user.controller");

// ✅ GET user profile by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await UserController.getProfile(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("❌ Error fetching profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ PUT update user profile by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await UserController.updateProfile(req.params.id, req.body);
    if (!updated.modifiedCount) {
      return res.status(404).json({ message: "Profile not updated. User may not exist." });
    }
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
