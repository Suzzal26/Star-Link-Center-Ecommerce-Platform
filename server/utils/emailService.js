const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // ✅ Auto-detect SSL if needed
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ Email for account verification
exports.sendVerificationEmail = async (email, token) => {
  const verifyLink = `http://localhost:5000/api/v1/auth/verify-email/${token}`;

  const message = `
    <h2>Email Verification</h2>
    <p>Click the link below to verify your email:</p>
    <a href="${verifyLink}">${verifyLink}</a>
  `;

  console.log("📨 Verification link:", verifyLink); // ✅ log the actual link

  await transporter.sendMail({
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: message,
  });
};

// ✅ Email for OTP during order placement
exports.sendOrderOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify Your Order - OTP Code",
    html: `
      <h2>Your OTP Code</h2>
      <p>Use this code to verify your order: <strong>${otp}</strong></p>
      <p>This code will expire soon. Please do not share it.</p>
    `,
  });
};

// ✅ Order Confirmation Mail
exports.sendOrderConfirmationEmail = async (email, orderId) => {
  const message = `
    <h2>Your Order has been Confirmed ✅</h2>
    <p>Dear Customer,</p>
    <p>Your order <strong>#${orderId}</strong> has been confirmed by our admin.</p>
    <p>We'll notify you once it's out for delivery. Thank you for shopping with us!</p>
  `;

  await transporter.sendMail({
    from: `"Star Link Center" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Order Confirmed - Star Link Center",
    html: message,
  });
};

//Delivered Mail
exports.sendOrderDeliveredEmail = async (email, orderId) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your Order Has Been Delivered",
    html: `
      <h2>Order Delivered</h2>
      <p>Your order <strong>#${orderId}</strong> has been delivered successfully.</p>
      <p>Thank you for shopping with us!</p>
    `,
  });
};

// Cancelled Mail
exports.sendOrderCancelledEmail = async (email, orderId) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your Order Has Been Cancelled",
    html: `
      <h2>Order Cancelled</h2>
      <p>Your order <strong>#${orderId}</strong> has been cancelled by our admin.</p>
      <p>If you have any questions, please <a href='mailto:support@youritcenter.com'>contact us</a> for more information.</p>
    `,
  });
};
