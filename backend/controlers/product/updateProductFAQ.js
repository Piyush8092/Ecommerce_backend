let Product = require("../../models/productModel");

const updateProductFAQ = async (req, res) => {
  try {
    let id = req.params.id;
    let faqArrayId = req.params.faqId;
    let { question, answer } = req.body;

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

    // Find the FAQ item by array index and update it
    if (faqArrayId < 0 || faqArrayId >= product.userCaseFAQ.length) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    product.userCaseFAQ[faqArrayId].question = question;
    product.userCaseFAQ[faqArrayId].answer = answer;
    await product.save();

    res.json({
      message: "FAQ updated successfully",
      status: 200,
      data: product,
      success: true,
      error: false,
    });
  } catch (e) {
    console.error("Error updating FAQ:", e);
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { updateProductFAQ };
