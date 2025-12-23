let productModel = require("../../models/productModel");

const getTotalProductCount = async (req, res) => {
  try {
    let totalProductCount = await productModel.countDocuments();
    res.status(200).json({
      message: "Total product count retrieved successfully",
      data: totalProductCount,
      success: true,
      error: false,
    });
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: true,
    });
  }
};

module.exports = { getTotalProductCount };
