let Product = require("../../models/productModel");

const createComments = async (req, res) => {
  try {
    let id = req.params.id;
    let { comment, rating, reviews } = req.body;
    let userId = req.user._id;
    if (!comment || !rating || !reviews) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.comments.push({
      comment,
      rating,
      reviews,
      userId,
    });
    await product.save();
    res.json({
      message: "Comment created successfully",
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

module.exports = { createComments };
