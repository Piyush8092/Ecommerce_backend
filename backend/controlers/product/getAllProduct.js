let Product = require("../../models/productModel");

const getAllProduct = async (req, res) => {
  try {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let skip = (page - 1) * limit;

    let total = await Product.countDocuments();
    let totalPages = Math.ceil(total / limit);
    let products = await Product.find()
      .skip(skip)
      .limit(limit)
      .populate("categoryIds", "name");

    res.json({
      message: "Product fetched successfully",
      status: 200,
      data: products,
      success: true,
      error: false,
      total,
      totalPages,
    });
  } catch (e) {
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e,
      success: false,
      error: true,
    });
  }
};

module.exports = { getAllProduct };
