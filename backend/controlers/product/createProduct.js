let Product = require("../../models/productModel");

const createProduct = async (req, res) => {
  try {
    let role = req.user.role;
    if (role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { name, price, description, categoryIds, stock } = req.body;

    if (!name || !price || !description || !stock) {
      return res.status(400).json({
        message: "Name, price, description and stock are required",
      });
    }
    
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one category is required" });
    }

    // Create new product (images can be added later via update)
    const newProduct = new Product(req.body);

    const savedProduct = await newProduct.save();

    res.json({
      message: "Product created successfully",
      status: 200,
      data: savedProduct,
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

module.exports = { createProduct };
