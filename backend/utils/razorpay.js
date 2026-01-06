const crypto = require("crypto");

const verifyRazorpaySignature = (req) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  const receivedSignature = req.headers["x-razorpay-signature"];

  return expectedSignature === receivedSignature;
};

module.exports = { verifyRazorpaySignature };
