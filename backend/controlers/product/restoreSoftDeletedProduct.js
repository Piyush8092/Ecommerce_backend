const Product = require("../../models/productModel");

const restoreSoftDeletedProduct = async (req, res) => {
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

    if (!product.isDeleted) {
      return res.json({
        message: "Product is not deleted",
        status: 400,
        success: false,
        error: true,
      });
    }

    product.isDeleted = false;
    product.deletedAt = null;
    await product.save();

    res.json({
      message: "Product restored successfully",
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

module.exports = { restoreSoftDeletedProduct };
