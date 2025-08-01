const AuthService = require("./authService"); // ✅ Keep this
const User = require("../users/user.model");
const generateAuthToken = require("./authService").generateAuthToken; // ✅ Add this line
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");

// ✅ Load environment variables
require("dotenv").config();

// ✅ Set up email transporter using .env variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // ❌ DO NOT use `true` for Gmail
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 🟢 Register User & Send Verification Email
exports.register = async (req, res) => {
  try {
    const { user, token, verificationToken } = await AuthService.registerUser(
      req.body
    );

    if (!token) {
      console.error("❌ Token generation failed in register");
      return res.status(500).json({ error: "Failed to generate token" });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Send email verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    try {
      let info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Verify Your Email - Star Link Center",
        html: `<p>Click the link below to verify your email:</p>
               <a href="${verificationLink}">${verificationLink}</a>
               <p>If you didn't register, please ignore this email.</p>`,
      });

      console.log(`✅ Email sent to ${user.email}: ${info.messageId}`);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      return res
        .status(500)
        .json({
          error: "Failed to send verification email. Please try again later.",
        });
    }

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user,
      token, // 🔵 Added token to response for debugging
    });
  } catch (error) {
    console.error("❌ Registration failed:", error);
    res.status(400).json({ error: error.message });
  }
};

// 🟢 Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("🔍 Received verification token:", token);

    const result = await AuthService.verifyEmail(token);

    if (!result || !result.user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token." });
    }

    // ✅ Corrected line: use result.user
    const loginToken = await AuthService.generateAuthToken(
      result.user._id,
      result.user.role
    );

    res.cookie("token", loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message:
        result.message || "Email verified successfully. You can now log in.",
      user: result.user,
      token: loginToken,
    });
  } catch (error) {
    console.error("❌ Error in email verification:", error);
    res.status(400).json({ error: error.message });
  }
};

// 🟢 Login User
// 🟢 Login User
exports.login = async (req, res) => {
  try {
    console.log("🛠️ Backend Received Login Request:", req.body); // Debugging Log

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password +isVerified");

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "Please verify your email before logging in." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log("✅ Login Successful, Token Generated:", token); // Debugging Log

    res.status(200).json({ user, token });
  } catch (error) {
    console.error("❌ Backend Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🟢 Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email, otp } = await AuthService.generateResetOTP(req.body.email);

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset OTP - Star Link Center",
      text: `Your OTP code is: ${otp}. This code is valid for 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("❌ Error in forgot password:", error);
    res.status(400).json({ error: error.message });
  }
};

// 🟢 Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    await AuthService.resetPassword(email, otp, newPassword);
    res
      .status(200)
      .json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("❌ Error in reset password:", error);
    res.status(400).json({ error: error.message });
  }
};

// 🟢 Logout
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};
