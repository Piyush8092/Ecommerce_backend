const Product = require("../../models/productModel");

const getProductSearchFilters = async (req, res) => {
  try {
    const { query } = req.query;
    // Build search filter
    const searchFilter = { isDeleted: false };

    if (query) {
      searchFilter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ];
    }

    // 1. Get min and max price
    const priceStats = await Product.aggregate([
      { $match: searchFilter },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    const { minPrice = 0, maxPrice = 0 } = priceStats[0] || {};

    // 2. Get unique colors
    const colors = await Product.distinct("colors", searchFilter);

    // 3. Get unique sizes
    const sizes = await Product.distinct("sizes", searchFilter);

    res.json({
      message: "Filter metadata fetched successfully",
      success: true,
      data: {
        minPrice,
        maxPrice,
        colors,
        sizes,
      },
    });
  } catch (err) {
    console.error("Error fetching filter metadata:", err);
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};

module.exports = { getProductSearchFilters };
