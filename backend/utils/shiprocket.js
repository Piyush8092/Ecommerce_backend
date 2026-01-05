const crypto = require("crypto");

const verifyShiprocketSignature = (req) => {
  const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;

  // Use raw body for signature verification
  const payload = req.body;
  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const signature = req.headers["x-shiprocket-signature"];
  return hash === signature;
};

module.exports = { verifyShiprocketSignature };
