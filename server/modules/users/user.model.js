const mongoose = require("mongoose");
const { hashPassword, comparePassword } = require("../../utils/bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    address: {
      type: String,
      required: true,
      trim: true,
    },
lat: { type: Number, default: null },
lng: { type: Number, default: null },

    contactNumber: {
      type: String,
      default: "",
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    verificationTokenExpires: { type: Date, default: null },
    isActive: { type: Boolean, default: true },

    // ✅ OTP-based password reset
    resetOTP: { type: String, default: null },
    resetOTPExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// ✅ Hash password only if modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
  next();
});

// ✅ Password comparison method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await comparePassword(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
