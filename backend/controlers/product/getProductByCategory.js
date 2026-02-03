let Product = require("../../models/productModel");

const getProductByCategory = async (req, res) => {
  try {
    let categoryId = req.params.categoryId;
    let limit = req.query.limit || 20;

    const products = await Product.find({ categoryIds: categoryId,  isDeleted: false }).limit(
      limit
    );
    res.json({
      message: "Product fetched successfully",
      status: 200,
      data: products,
      success: true,
      error: false,
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

module.exports = { getProductByCategory };
