const express = require("express");
const router = express.Router();
const Message = require("./Message");
const User = require("../users/user.model");
const nodemailer = require("nodemailer");

// Setup transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// POST /api/v1/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Save message to DB
    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();

    // 🔍 Find all admins
    const admins = await User.find({ role: "admin" });
    const adminEmails = admins.map((admin) => admin.email);

    if (adminEmails.length === 0) {
      return res.status(500).json({ error: "No admin emails found." });
    }

    // ✅ Send to all admin emails
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: adminEmails.join(","),
      subject: `New Contact Message: ${subject}`,
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message}</p>
        <hr>
        <p>Reply to this email to respond directly to the user.</p>
      `,
    });

    res.status(200).json({ message: "Message sent to admin(s) successfully." });
  } catch (error) {
    console.error("❌ Contact route error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

module.exports = router;
