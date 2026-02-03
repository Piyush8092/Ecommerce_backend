const Product = require("../../models/productModel");
const mongoose = require("mongoose");

const getProductByCategoryIds = async (req, res) => {
  try {
    // Extract categoryIds from query params
    let categoryIds = req.query["categoryIds[]"] || req.query.categoryIds;
    const limit = Number(req.query.limit) || 20;

    if (!categoryIds) {
      return res.status(400).json({
        message: "categoryIds query param is required",
        success: false,
        error: true,
      });
    }

    // Normalize to array
    if (!Array.isArray(categoryIds)) {
      categoryIds = String(categoryIds).split(",");
    }

    // Validate ObjectIds
    categoryIds = categoryIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (!categoryIds.length) {
      return res.status(400).json({
        message: "No valid categoryIds provided",
        success: false,
        error: true,
      });
    }

    const products = await Product.find({
      categoryIds: { $in: categoryIds },
      isDeleted: false,
    }).limit(limit);

    return res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      error: false,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: true,
    });
  }
};

module.exports = { getProductByCategoryIds };
