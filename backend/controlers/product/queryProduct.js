const Product = require("../../models/productModel");

const queryProduct = async (req, res) => {
  try {
    const { mongoQuery, sort } = req;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // 1. total matched products count
    const totalDocuments = await Product.countDocuments({
      ...mongoQuery,
      isDeleted: false,
    });

    // 2. paginated list
    const products = await Product.find({ ...mongoQuery, isDeleted: false })
      .skip(skip)
      .limit(Number(limit))
      .sort(sort);

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
