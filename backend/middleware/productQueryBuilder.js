function buildMongoQuery(req) {
  const { query, priceMin, priceMax, colors, sizes } = req.query;

  const andConditions = [];

  // Search
  if (query) {
    andConditions.push({
      $or: [
        { name: new RegExp(query, "i") },
        { description: new RegExp(query, "i") },
      ],
    });
  }

  // Price
  if (priceMin || priceMax) {
    const priceFilter = {};
    if (priceMin) priceFilter.$gte = Number(priceMin);
    if (priceMax) priceFilter.$lte = Number(priceMax);
    andConditions.push({ price: priceFilter });
  }

  // Colors
  if (colors) {
    andConditions.push({ colors: { $in: colors.split(",") } });
  }

  // Sizes
  if (sizes) {
    andConditions.push({ sizes: { $in: sizes.split(",") } });
  }

  // Final
  return andConditions.length > 0 ? { $and: andConditions } : {};
}

function buildSort(req) {
  const { sortBy } = req.query;

  // You can customize sort options
  const sortOptions = {
    price_low_to_high: { price: 1 },
    price_high_to_low: { price: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };

  return sortOptions[sortBy] || { createdAt: -1 };
}

// MAIN middleware
module.exports = function queryBuilder(req, res, next) {
  req.mongoQuery = buildMongoQuery(req);
  req.sort = buildSort(req);

  next();
};
