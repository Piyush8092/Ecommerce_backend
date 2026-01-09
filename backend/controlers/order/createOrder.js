const Order = require("../../models/orderModel");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");

const createOrder = async (req, res) => {
  try {
    let userId = req.user._id;
    let payload = req.body;

    // Validate required fields
    if (
      !payload.deliveryAddressId ||
      !payload.items ||
      payload.items.length === 0 ||
      !payload.totalAmount
    ) {
      return res.status(400).json({
        message: "All fields are required",
        status: 400,
        success: false,
        error: true,
      });
    }

    payload.userId = userId;

    // Validate Razorpay payment - Only PREPAID payments accepted
    if (!payload.paymentType) {
      payload.paymentType = "PREPAID";
    }

    // Verify Razorpay payment details are present
    if (!payload.razorpayPaymentId || !payload.razorpayOrderId) {
      return res.status(400).json({
        message:
          "Payment verification required. Please complete payment through Razorpay.",
        status: 400,
        success: false,
        error: true,
      });
    }

    // Set payment status to PAID (payment already verified before order creation)
    payload.paymentStatus = "PAID";

    // Set initial shipment status
    if (!payload.shipmentStatus) {
      payload.shipmentStatus = "NOT_CREATED";
    }

    // Create new order
    const newOrder = new Order(payload);
    const savedOrder = await newOrder.save();

    // Update stock number after order placed
    if (payload.orderSource === "CART") {
      await Promise.all(
        payload.items.map(async (item) => {
          const product = await Product.findById(item.productId);
          if (product) {
            console.log(product);
            product.stock -= item.quantity;
            await product.save();
          }
        })
      );
    } else if (payload.orderSource === "BUY_NOW") {
      const item = payload.items[0];
      const product = await Product.findById(item.productId);
      if (product) {
        console.log(product.stock);
        product.stock -= item.quantity;
        console.log(product.stock);
        await product.save();
      }
    }

    // empty the user's cart after order creation
    if (payload.orderSource === "CART") {
      await Cart.deleteMany({ userId });
    }

    // Populate order details for response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId");

    res.json({
      message: "Order created successfully",
      status: 200,
      data: populatedOrder,
      success: true,
      error: false,
    });
  } catch (e) {
    console.error("Create Order Error:", e);
    res.status(500).json({
      message: "Something went wrong",
      status: 500,
      data: e.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { createOrder };
