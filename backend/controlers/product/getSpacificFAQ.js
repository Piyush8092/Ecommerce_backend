let Product = require("../../models/productModel");

const getSpacificFAQ = async (req, res) => {
  try {
    let id = req.params.id;

    const product = await Product.findOne({
      _id: id,
      isDeleted: false,
      approvalStatus: "APPROVED",
    });
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let faq = product.userCaseFAQ;

    res.json({
      message: "FAQ fetched successfully",
      status: 200,
      data: faq,
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

module.exports = { getSpacificFAQ };
