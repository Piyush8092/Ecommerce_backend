const verifyShiprocketSignature = (req) => {
  const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;

  const signature = req.headers["x-api-key"];

  return secret === signature;
};

module.exports = { verifyShiprocketSignature };
