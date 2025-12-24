let Cart = require("../../models/cartModel");

const createCart = async (req, res) => {
  try {
    let userId = req.user._id;
    let { productId, quantity, size, color } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new cart
    const newCart = new Cart({
      userId,
      productId,
      quantity,
      size,
      color,
    });

    const savedCart = await newCart.save();

    res.json({
      message: "Cart created successfully",
      status: 200,
      data: savedCart,
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

module.exports = { createCart };
