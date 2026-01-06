const crypto = require("crypto");

const verifyRazorpaySignature = (req) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!req.rawBody) {
    throw new Error("Raw body not available");
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.rawBody)
    .digest("hex");

  const receivedSignature = req.headers["x-razorpay-signature"];

  return expectedSignature === receivedSignature;
};

module.exports = { verifyRazorpaySignature };
