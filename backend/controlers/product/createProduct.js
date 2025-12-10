let Product = require("../../models/productModel");
const createProduct = async (req, res) => {
  try {
    let role = req.user.role;
    if (role !== "ADMIN") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { name, image, price, description, catagory, discount, stock } =
      req.body;

    if (!name || !image || !price || !description || !catagory || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Create new product
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
