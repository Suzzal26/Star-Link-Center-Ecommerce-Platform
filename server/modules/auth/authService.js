const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../users/user.model");
const { sendVerificationEmail } = require("../../utils/emailService");

// ✅ Generate Authentication Token (Used for login)
const generateAuthToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ✅ Generate a Random Verification Token
const generateVerificationToken = () => crypto.randomBytes(32).toString("hex");

// ✅ Validate Email Format
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// ✅ Allowed Email Domains
const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
const blockedDomains = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
];

const validatePassword = (password) => {
  // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
  return passwordRegex.test(password);
};


const registerUser = async ({
  name,
  email,
  password,
  role,
  address,
  contactNumber,
  lat,
  lng,
}) => {
  try {
    if (!isValidEmail(email)) throw new Error("Invalid email format");

    const domain = email.split("@")[1];
    if (blockedDomains.includes(domain)) throw new Error("Temporary emails are not allowed");
    if (!allowedDomains.includes(domain)) throw new Error("Email domain not allowed");

    const cityGuess = address.split(",").map((p) => p.trim().toLowerCase());
    const allowedCities = ["kathmandu", "lalitpur", "bhaktapur"];
    const match = cityGuess.find((part) => allowedCities.includes(part));
    if (!match) throw new Error("Address must be within Kathmandu Valley.");

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already exists");

    const verificationToken = generateVerificationToken();
    console.log("🔑 [BEFORE SAVE] Token to save:", verificationToken);

    const user = await User.create({
      name,
      email,
      password,
      role,
      address,
      contactNumber,
      lat,
      lng,
      isVerified: false,
      verificationToken,
    });

    // ✅ FIX: Do NOT use .lean() here
    const freshUser = await User.findById(user._id);
    console.log("🧾 [AFTER SAVE] Token in DB:", freshUser.verificationToken);

    if (!freshUser.verificationToken) {
      throw new Error("❌ Token not saved — pre-save hook or schema issue.");
    }

    await sendVerificationEmail(email, verificationToken);

    const token = generateAuthToken(freshUser._id, freshUser.role);
    return { user: freshUser, token, verificationToken };
  } catch (error) {
    console.error("❌ Error in registerUser:", error.message);
    throw error;
  }
};


// ✅ Verify Email
const verifyEmail = async (token) => {
  try {
    const maxAttempts = 5;
    let attempts = 0;
    let user;

    while (attempts < maxAttempts && !user) {
      user = await User.findOne({ verificationToken: token });
      if (!user) {
        await new Promise((res) => setTimeout(res, 500)); // wait 500ms
        attempts++;
      }
    }

    if (!user) throw new Error("Invalid or expired verification token.");

    if (user.isVerified) {
      return { message: "User already verified", user };
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    const loginToken = generateAuthToken(user._id, user.role);
    return { message: "Email verified successfully", user, token: loginToken };
  } catch (error) {
    console.error("❌ Error in verifyEmail:", error.message);
    throw error;
  }
};


// ✅ Login User
const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "email password isVerified role name"
    );
    if (!user) throw new Error("Invalid email or password");

    console.log("🔐 Comparing passwords...");
    console.log("Plain password:", password);
    console.log("Hashed from DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      throw new Error("Invalid email or password");
    }

    if (!user.isVerified)
      throw new Error("Please verify your email before logging in.");

    const token = generateAuthToken(user._id, user.role);

    return {
      token,
      user: {
        _id: user._id,
        name: user.name || "Unknown",
        email: user.email,
        role: user.role || "user",
        isVerified: user.isVerified,
      },
    };
  } catch (error) {
    console.error("❌ Error in loginUser:", error.message);
    throw error;
  }
};

// ✅ Generate Reset OTP (for forgot password)
const generateResetOTP = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    console.log("✅ Reset OTP:", otp);
    return { email, otp };
  } catch (error) {
    console.error("❌ Error in generateResetOTP:", error.message);
    throw error;
  }
};

// ✅ Reset Password
const resetPassword = async (email, otp, newPassword) => {
  try {
    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error("Invalid or expired OTP");

    user.password = newPassword; // ✅ Let pre-save hook handle hashing
    user.resetOTP = null;
    user.resetOTPExpires = null;
    await user.save();

    console.log("🎉 Password reset successful:", user.email);
    return { message: "Password reset successful" };
  } catch (error) {
    console.error("❌ Error in resetPassword:", error.message);
    throw error;
  }
};

// ✅ Export all functions
module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  generateResetOTP,
  resetPassword,
  generateAuthToken,
};
