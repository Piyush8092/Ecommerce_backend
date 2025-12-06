let Product = require("../../models/productModel");

const getTopSellingProduct = async (req, res) => {
  try {
    const products = await Product.find({ topSelling: true });
    res.json({
      message: "Top selling products fetched successfully",
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

module.exports = { getTopSellingProduct };
