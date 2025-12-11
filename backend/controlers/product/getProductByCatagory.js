let Product = require("../../models/productModel");

const getProductByCatagory = async (req, res) => {
  try {
    let categoryId = req.params.categoryId;

    const products = await Product.find({ categoryId }).populate("categoryId");
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

module.exports = { getProductByCatagory };
