let Product = require("../../models/productModel");

const queryProduct = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let searchConditions = {};

    if (query) {
      let numericQuery = Number(query);

      // If query is a number → treat as price search
      if (!isNaN(numericQuery)) {
        searchConditions = {
          $or: [
            {
              price: {
                $gte: numericQuery - 200, // flexible price band
                $lte: numericQuery + 200,
              },
            },
            { stock: numericQuery },
            { discount: numericQuery },
          ],
        };
      } else {
        // Text search
        searchConditions = {
          $or: [
            { name: new RegExp(query, "i") },
            { description: new RegExp(query, "i") },
            { category: new RegExp(query, "i") },
          ],
        };
      }
    }

    // 1. total matched products count
    const totalDocuments = await Product.countDocuments(searchConditions);

    // 2. paginated list
    const products = await Product.find(searchConditions)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      message: "Products fetched successfully",
      data: products,
      total: totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
      success: true,
      error: false,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Something went wrong",
      error: true,
      success: false,
    });
  }
};

module.exports = { queryProduct };
