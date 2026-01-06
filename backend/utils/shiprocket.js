const crypto = require("crypto");

const verifyShiprocketSignature = (req) => {
  const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;

  if (!req.rawBody) {
    throw new Error("Raw body not available");
  }

  const hash = crypto
    .createHmac("sha256", secret)
    .update(req.rawBody)
    .digest("hex");

  const signature = req.headers["x-shiprocket-signature"];

  return hash === signature;
};

module.exports = { verifyShiprocketSignature };
