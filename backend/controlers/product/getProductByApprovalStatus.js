let Product = require("../../models/productModel");

const getProductByApprovalStatus = async (req, res) => {
  try {
    const status = req.query.status; // approved | pending | rejected
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    // Base filter
    const filter = {
      approvalStatus: status,
      isDeleted: false,
    };

    const total = await Product.countDocuments(filter);
    let totalPages = Math.ceil(total / limit);

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("categoryIds", "name");

    res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      error: false,
      data: products,
      total,
      totalPages,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
      data: e,
    });
  }
};

module.exports = { getProductByApprovalStatus };
