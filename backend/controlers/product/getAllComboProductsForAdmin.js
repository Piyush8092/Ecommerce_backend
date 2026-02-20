let Product = require("../../models/productModel");

const getAllComboProductsForAdmin = async (req, res) => {
  try {
    // let page = parseInt(req.query.page) || 1;
    // let limit = parseInt(req.query.limit) || 10;
    // let skip = (page - 1) * limit;

    const query = {
      isDeleted: false,
      approvalStatus: "APPROVED",
      isComboProduct: true,
    };

    // let total = await Product.countDocuments(query);
    // let totalPages = Math.ceil(total / limit);

    let products = await Product.find(query)
      // .skip(skip)
      // .limit(limit)
      .populate("categoryIds", "name");

    res.json({
      message: "Combo products fetched successfully",
      status: 200,
      data: products,
      success: true,
      error: false,
      // total,
      // totalPages,
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

module.exports = { getAllComboProductsForAdmin };
