const Order = require("../../models/orderModel");
const Shipment = require("../../models/shipmentModel");
const shiprocketService = require("../../services/shiprocket.service");
const razorpayService = require("../../services/razorpay.service");
const Product = require("../../models/productModel");

/**
 * Cancel Order
 * Handles refund, shipment cancellation, and order status update
 */
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = req.user;
    const { reason, refundAmount } = req.body || {};

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
        error: true,
      });
    }

    // Idempotency
    if (order.status === "CANCELLED") {
      return res.json({
        message: "Order already cancelled",
        data: order,
        success: true,
        error: false,
      });
    }

    // Prevent cancelling delivered orders
    if (order.status === "DELIVERED") {
      return res.status(400).json({
        message: "Delivered orders cannot be cancelled",
        success: false,
        error: true,
      });
    }

    const isStaff = ["ADMIN", "MANAGER", "EMPLOYEE"].includes(user.role);
    const isCreator = order.userId.toString() === user._id.toString();

    // Not staff and not creator → blocked
    if (!isStaff && !isCreator) {
      return res.status(403).json({
        message: "Forbidden - You don't have permission",
        success: false,
        error: true,
      });
    }

    let finalReason = reason;
    let finalRefundAmount = refundAmount;

    if (isCreator) {
      if (!["PENDING", "ACCEPTED"].includes(order.status)) {
        return res.status(400).json({
          message: "You can cancel only pending or accepted orders",
          success: false,
          error: true,
        });
      }

      finalRefundAmount = order.prepaidAmount;
      finalReason = "Cancelled by user";
    }

    if (!finalReason || !finalReason.trim()) {
      return res.status(400).json({
        message: "Cancellation reason is required",
        success: false,
        error: true,
      });
    }

    // -----------------------------
    // Cancel Shipment if exists
    // -----------------------------
    const shipment = await Shipment.findOne({ orderId });

    if (
      shipment &&
      shipment.awb &&
      !["DELIVERED", "CANCELLED"].includes(shipment.shipmentStatus)
    ) {
      const cancelResult = await shiprocketService.cancelShipment(shipment.awb);

      if (!cancelResult.success) {
        return res.status(500).json({
          message: "Failed to cancel shipment",
          data: cancelResult.error,
          success: false,
          error: true,
        });
      }

      shipment.shipmentStatus = "CANCELLED";
      await shipment.save();
    }

    let refundResult = null;

    // -----------------------------
    // Handle Refund
    // -----------------------------
    if (order.paymentStatus === "PAID" && order.razorpayPaymentId) {
      const safeRefundAmount =
        typeof finalRefundAmount === "number" && finalRefundAmount > 0
          ? Math.min(finalRefundAmount, order.prepaidAmount)
          : order.prepaidAmount;

      refundResult = await razorpayService.refundPayment(
        order.razorpayPaymentId,
        {
          amount: safeRefundAmount,
          reason: finalReason,
        }
      );

      order.razorpayRefundId = refundResult.data?.refundId;
      order.refundAmount = safeRefundAmount;
      order.paymentStatus = "REFUND_INITIATED";
    }

    // -----------------------------
    // Update Order
    // -----------------------------
    order.status = "CANCELLED";
    order.shipmentStatus = "CANCELLED";
    order.cancelReason = finalReason;
    order.cancelBy = isStaff ? user.role : "USER";
    order.cancelledAt = new Date();

    await order.save();

    // -----------------------------
    // Update product stock if order is cancelled
    // -----------------------------
    await Promise.all(
      order.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (product) {
          console.log(product);
          product.stock += item.quantity;
          console.log(product.stock);
          await product.save();
        }
      })
    );

    res.json({
      message: "Order cancelled successfully",
      data: {
        order,
        refund: refundResult,
      },
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({
      message: "Failed to cancel order",
      data: error.message,
      success: false,
      error: true,
    });
  }
};

module.exports = { cancelOrder };
