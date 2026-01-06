const crypto = require("crypto");

const verifyShiprocketSignature = (req) => {
  const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;

  if (!req.body || !Buffer.isBuffer(req.body)) {
    throw new Error("Raw body not found. Use express.raw middleware.");
  }

  // Use raw body for signature verification
  const payload = req.body.toString("utf8");
  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const signature = req.headers["x-shiprocket-signature"];
  return hash === signature;
};

module.exports = { verifyShiprocketSignature };
