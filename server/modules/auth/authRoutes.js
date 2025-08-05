const express = require("express");
const router = express.Router();
const AuthController = require("./authController");

// ✅ Test route for debugging
router.get("/test", (req, res) => {
  console.log("🧪 Auth test route hit!");
  res.json({
    message: "Auth route is working!",
    timestamp: new Date().toISOString(),
  });
});

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/verify-email/:token", AuthController.verifyEmail);
router.post("/logout", AuthController.logout);

// ✅ Forgot Password - Generate Token
router.post("/generate-fp-token", AuthController.forgotPassword); // or use generateFPToken if renamed

// ✅ Reset Password with OTP
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
