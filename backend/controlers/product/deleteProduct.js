let mongoose = require("mongoose");
let Product = require("../../models/productModel");

const deleteProduct = async (req, res) => {
  try {
    let id = req.params.id;
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json({
      message: "Product deleted successfully",
      status: 200,
      data: deletedProduct,
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

module.exports = { deleteProduct };
