const shiprocketService = require("../../services/shiprocket.service");
const Order = require("../../models/orderModel");
const Shipment = require("../../models/shipmentModel");

/**
 * Create Shipment
 * Creates a shipment in Shiprocket for an order (ADMIN/MANAGER only)
 */
const createShipment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { courierId, pickupLocation } = req.body;

    // Check if user is ADMIN or MANAGER
    if (req.user.role !== "ADMIN" && req.user.role !== "MANAGER") {
      return res.status(403).json({
        message: "Unauthorized. Only ADMIN or MANAGER can create shipments",
        status: 403,
        success: false,
        error: true,
      });
    }

    // Find the order
    const order = await Order.findById(orderId)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId")
      .populate("productId", "name price image");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: 404,
        success: false,
        error: true,
      });
    }

    // Check if shipment already exists
    const existingShipment = await Shipment.findOne({ orderId });
    if (existingShipment) {
      return res.status(400).json({
        message: "Shipment already exists for this order",
        status: 400,
        data: existingShipment,
        success: false,
        error: true,
      });
    }

    // Prepare order items for Shiprocket
    const orderItems = order.productId.map((product) => ({
      name: product.name,
      sku: product._id.toString(),
      units: 1,
      selling_price: product.price,
      discount: 0,
    }));

    // Prepare Shiprocket order data
    const shiprocketOrderData = {
      orderId: order._id.toString(),
      orderDate: order.createdAt.toISOString().split('T')[0],
      pickupLocation: pickupLocation || "Primary",
      billingCustomerName: order.deliveryAddressId.name,
      billingLastName: "",
      billingAddress: order.deliveryAddressId.Address,
      billingCity: order.deliveryAddressId.city,
      billingPincode: order.deliveryAddressId.zip,
      billingState: order.deliveryAddressId.state,
      billingCountry: "India",
      billingEmail: order.deliveryAddressId.email || order.userId.email,
      billingPhone: order.deliveryAddressId.phoneNo,
      shippingIsBilling: true,
      orderItems: orderItems,
      paymentMethod: order.paymentMethod === "COD" ? "COD" : "Prepaid",
      subTotal: order.totalAmount,
    };

    // Create order in Shiprocket
    const shiprocketResult = await shiprocketService.createOrder(shiprocketOrderData);

    if (!shiprocketResult.success) {
      return res.status(500).json({
        message: "Failed to create shipment in Shiprocket",
        status: 500,
        data: shiprocketResult.error,
        success: false,
        error: true,
      });
    }

    // Create shipment record in database
    const shipment = new Shipment({
      orderId: order._id,
      shiprocketOrderId: shiprocketResult.data.order_id,
      shiprocketShipmentId: shiprocketResult.data.shipment_id,
      shipmentStatus: "PENDING",
    });

    // If courier ID is provided, generate AWB
    if (courierId) {
      const awbResult = await shiprocketService.generateAWB(
        shiprocketResult.data.shipment_id,
        courierId
      );

      if (awbResult.success && awbResult.data.response) {
        shipment.awb = awbResult.data.response.data.awb_code;
        shipment.courierName = awbResult.data.response.data.courier_name;
        shipment.courierId = courierId;
        shipment.shipmentStatus = "PICKUP_SCHEDULED";
      }
    }

    await shipment.save();

    // Update order shipment status
    order.shipmentStatus = shipment.shipmentStatus;
    await order.save();

    res.json({
      message: "Shipment created successfully",
      status: 200,
      data: shipment,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Create Shipment Error:", error);
    res.status(500).json({
      message: "Failed to create shipment",
      status: 500,
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { createShipment };

