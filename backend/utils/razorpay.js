const crypto = require("crypto");

const verifyRazorpaySignature = (req) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!req.body || !Buffer.isBuffer(req.body)) {
    throw new Error("Raw body not found. Use express.raw middleware.");
  }

  console.log(req.body);

  const payload = req.body.toString("utf8");

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const receivedSignature = req.headers["x-razorpay-signature"];

  return expectedSignature === receivedSignature;
};

module.exports = { verifyRazorpaySignature };
