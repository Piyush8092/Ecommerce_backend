let Product = require("../../models/productModel");

const getAllComboProducts = async (req, res) => {
  try {
    const query = {
      isDeleted: false,
      approvalStatus: "APPROVED",
      isComboProduct: true,
    };

    let products = await Product.find(query).lean();

    res.json({
      message: "Combo products fetched successfully",
      status: 200,
      data: products,
      success: true,
      error: false,
    });
  } catch (e) {
    res.json({
      message: "Something went wrong",
      status: 500,
      data: e.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { getAllComboProducts };
