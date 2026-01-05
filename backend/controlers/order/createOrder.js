let Order = require("../../models/orderModel");

const createOrder = async (req, res) => {
  try {
    let userId = req.user._id;
    let payload = req.body;

    // Validate required fields
    if (
      !payload.deliveryAddressId ||
      !payload.productId ||
      payload.productId.length === 0 ||
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
    if (!payload.paymentMethod) {
      payload.paymentMethod = "PREPAID";
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

    // TODO: Update stock number after order placed

    const savedOrder = await newOrder.save();

    // Populate order details for response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId")
      .populate("productId", "name price image length breadth height weight");

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
