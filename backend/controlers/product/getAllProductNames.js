let Product = require("../../models/productModel");

const getAllProductNames = async (req, res) => {
  try {
    let role = req.user.role;

    if (role !== "ADMIN") {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        error: true,
      });
    }

    const products = await Product.find({}, { name: 1 })
      .sort({ name: 1 })
      .lean();

    res.json({
      message: "Product names fetched successfully",
      status: 200,
      data: products,
      success: true,
      error: false,
    });
  } catch (e) {
    console.error("getAllProductNames error:", e);

    res.json({
      message: "Something went wrong",
      status: 500,
      data: e,
      success: false,
      error: true,
    });
  }
};

module.exports = { getAllProductNames };
