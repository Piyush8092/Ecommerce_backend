const verifyShiprocketSignature = (req) => {
  const secret = process.env.SHIPROCKET_WEBHOOK_SECRET;

  const signature = req.headers["x-api-key"];

  return secret === signature;
};

const getOrderItemsDimensions = (items) => {
  let totalWeight = 0;
  let totalHeight = 0;
  let maxLength = 0;
  let maxBreadth = 0;

  for (const item of items) {
    const { dimensions, quantity } = item;

    if (!dimensions) continue;

    const { length = 0, breadth = 0, height = 0, weight = 0 } = dimensions;

    totalWeight += weight * quantity;
    totalHeight += height * quantity;

    if (length > maxLength) maxLength = length;
    if (breadth > maxBreadth) maxBreadth = breadth;
  }

  return {
    length: Math.ceil(maxLength),
    breadth: Math.ceil(maxBreadth),
    height: Math.ceil(totalHeight),
    weight: Number(totalWeight.toFixed(2)),
  };
};

module.exports = { verifyShiprocketSignature, getOrderItemsDimensions };
