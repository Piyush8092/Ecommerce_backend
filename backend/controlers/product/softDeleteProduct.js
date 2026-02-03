const Product = require("../../models/productModel");

const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.json({
        message: "Product not found",
        status: 404,
        success: false,
        error: true,
      });
    }

    if (product.isDeleted) {
      return res.json({
        message: "Product already deleted",
        status: 400,
        success: false,
        error: true,
      });
    }

    product.isDeleted = true;
    product.deletedAt = new Date();
    await product.save();

    res.json({
      message: "Product moved to bin",
      status: 200,
      success: true,
      error: false,
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

module.exports = { softDeleteProduct };
