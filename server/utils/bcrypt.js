const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

// ✅ Load environment variables
dotenv.config();

const hashPassword = async (string) => {
    console.log("🔢 SALT_ROUND in bcrypt.js:", process.env.SALT_ROUND || "NOT LOADED"); // Debugging log
    const saltRounds = parseInt(process.env.SALT_ROUND, 10) || 10;
    return await bcrypt.hash(string, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
    console.log("🔍 Comparing Passwords"); // Debugging log
    return await bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
