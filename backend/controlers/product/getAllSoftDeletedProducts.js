const Product = require("../../models/productModel");

const getAllSoftDeletedProducts = async (req, res) => {
  try {
    let page = req.query.page || 1;
    let limit = req.query.limit || 10;
    let skip = (page - 1) * limit;

    let total = await Product.countDocuments({ isDeleted: true });
    let totalPages = Math.ceil(total / limit);

    let products = await Product.find({ isDeleted: true })
      .skip(skip)
      .limit(limit)
      .sort({ deletedAt: -1 })
      .populate("categoryIds", "name");

    res.json({
      message: "Deleted products fetched successfully",
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
      success: false,
      error: true,
    });
  }
};

module.exports = { getAllSoftDeletedProducts };
