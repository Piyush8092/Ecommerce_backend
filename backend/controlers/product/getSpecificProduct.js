let Product = require("../../models/productModel");

const getSpecificProduct = async (req, res) => {
  try {
    let id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      isDeleted: false,
    });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product fetched successfully",
      status: 200,
      data: product,
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

module.exports = { getSpecificProduct };
