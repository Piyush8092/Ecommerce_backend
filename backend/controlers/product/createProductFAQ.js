let Product = require("../../models/productModel");

const createProductFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const { id } = req.params;

    if (req.user.role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!question || !answer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.userCaseFAQ.push({ question, answer });
    await product.save();

    res.json({
      message: "FAQ created successfully",
      status: 200,
      data: product,
      success: true,
      error: false,
    });
  } catch (e) {
    console.error("Error creating FAQ:", e);
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { createProductFAQ };
