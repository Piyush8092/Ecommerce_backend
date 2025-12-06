let Order = require("../../models/orderModel");

const createOrder = async (req, res) => {
  try {
    let userId = req.user._id;
    let payload = req.body;
    if (
      !payload.deliveryAddressId ||
      payload.productId == [] ||
      !payload.totalAmount
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    payload.userId = userId;

    // Create new order
    const newOrder = new Order(payload);

    // update stock no afer order palace

    const savedOrder = await newOrder.save();

    res.json({
      message: "Order created successfully",
      status: 200,
      data: savedOrder,
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

module.exports = { createOrder };
