const shiprocketService = require("../../services/shiprocket.service");
const Order = require("../../models/orderModel");
const Shipment = require("../../models/shipmentModel");
const shiprocketConfig = require("../../config/shiprocket.config");
const { getOrderItemsDimensions } = require("../../utils/shiprocket");

/**
 * Create Shipment
 * Creates a shipment in Shiprocket for an order
 */
const createShipment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { courierId } = req.body;

    // Find the order
    const order = await Order.findById(orderId)
      .populate("userId", "name email phone")
      .populate("deliveryAddressId");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: 404,
        success: false,
        error: true,
      });
    }

    if (order.status === "PENDING") {
      return res.status(400).json({
        message: "Order is pending",
        status: 400,
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
    const orderItems = order.items.map((item) => ({
      name: item.name,
      sku: item.productId.toString(),
      units: item.quantity,
      selling_price: item.price,
      discount: 0,
    }));

    const { length, breadth, height, weight } = getOrderItemsDimensions(
      order.items
    );

    // Prepare Shiprocket order data
    const shiprocketOrderData = {
      orderId: order._id.toString(),
      orderDate: order.createdAt.toISOString().split("T")[0],
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
      length,
      breadth,
      height,
      weight,
    };

    console.log("shiprocketOrderData", shiprocketOrderData);

    // Create order in Shiprocket
    const shiprocketResult =
      await shiprocketService.createOrder(shiprocketOrderData);

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
      pickupLocation: shiprocketConfig.defaultPickupLocation,
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
        shipment.expectedDeliveryDate = awbResult.data.response.data.expected_delivery_date; // Expected delivery date from Shiprocket
      }
    }

    await shipment.save();

    // Update order shipment status
    order.shipmentStatus = shipment.shipmentStatus;
    order.expectedDeliveryDate = shipment.expectedDeliveryDate;
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
