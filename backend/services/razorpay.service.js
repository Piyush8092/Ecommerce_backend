const Razorpay = require("razorpay");
const crypto = require("crypto");
const razorpayConfig = require("../config/razorpay.config");
const { rupeesToPaise } = require("../utils/money");

/**
 * Razorpay Service
 * Handles all Razorpay payment operations
 */
class RazorpayService {
  constructor() {
    // Validate configuration on initialization
    razorpayConfig.validate();

    // Initialize Razorpay instance
    this.razorpay = new Razorpay({
      key_id: razorpayConfig.keyId,
      key_secret: razorpayConfig.keySecret,
    });
  }

  /**
   * Create Razorpay Order
   * @param {Object} orderData - Order details
   * @param {Number} orderData.amount - Amount in rupees (will be converted to paise)
   * @param {String} orderData.currency - Currency code (default: INR)
   * @param {String} orderData.receipt - Receipt ID
   * @returns {Promise<Object>} Razorpay order object
   */
  async createOrder({ amount, currency = "INR", receipt }) {
    try {
      // Convert amount to paise (Razorpay expects amount in smallest currency unit)
      const amountInPaise = rupeesToPaise(amount);

      const options = {
        amount: amountInPaise,
        currency: currency,
        receipt:
          receipt || `${razorpayConfig.options.receipt_prefix}${Date.now()}`,
        payment_capture: razorpayConfig.options.payment_capture,
      };

      const order = await this.razorpay.orders.create(options);

      return {
        success: true,
        data: {
          orderId: order.id,
          amount: order.amount,
          amountInRupees: order.amount / 100,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status,
        },
      };
    } catch (error) {
      console.error("Razorpay Create Order Error:", error);
      return {
        success: false,
        error: error.message || "Failed to create Razorpay order",
      };
    }
  }

  /**
   * Verify Razorpay Payment Signature
   * @param {Object} paymentData - Payment verification data
   * @param {String} paymentData.razorpayOrderId - Razorpay order ID
   * @param {String} paymentData.razorpayPaymentId - Razorpay payment ID
   * @param {String} paymentData.razorpaySignature - Razorpay signature
   * @returns {Object} Verification result
   */
  verifyPaymentSignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }) {
    try {
      // Create expected signature
      const text = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSignature = crypto
        .createHmac("sha256", razorpayConfig.keySecret)
        .update(text)
        .digest("hex");

      // Compare signatures
      const isValid = expectedSignature === razorpaySignature;

      return {
        success: true,
        isValid,
        message: isValid
          ? "Payment verified successfully"
          : "Invalid payment signature",
      };
    } catch (error) {
      console.error("Razorpay Verify Signature Error:", error);
      return {
        success: false,
        isValid: false,
        error: error.message || "Failed to verify payment signature",
      };
    }
  }

  /**
   * Fetch Payment Details
   * @param {String} paymentId - Razorpay payment ID
   * @returns {Promise<Object>} Payment details
   */
  async fetchPayment(paymentId) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);

      return {
        success: true,
        data: {
          id: payment.id,
          amount: payment.amount / 100, // Convert paise to rupees
          currency: payment.currency,
          status: payment.status,
          method: payment.method,
          email: payment.email,
          contact: payment.contact,
          createdAt: new Date(payment.created_at * 1000),
        },
      };
    } catch (error) {
      console.error("Razorpay Fetch Payment Error:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch payment details",
      };
    }
  }

  /**
   * Refund Payment
   * @param {String} paymentId - Razorpay payment ID
   * @param {Number} amount - Amount to refund in rupees (optional, full refund if not provided)
   * @returns {Promise<Object>} Refund details
   */
  async refundPayment(paymentId, { amount = null, reason = null }) {
    try {
      const options = { reason }; // Optional reason for refund
      if (amount) {
        options.amount = rupeesToPaise(amount); // Convert to paise (Razorpay expects amount in smallest currency unit)
      }

      const refund = await this.razorpay.payments.refund(paymentId, options);

      return {
        success: true,
        data: {
          refundId: refund.id,
          paymentId: refund.payment_id,
          amount: refund.amount / 100,
          currency: refund.currency,
          status: refund.status,
        },
      };
    } catch (error) {
      console.error("Razorpay Refund Error:", error);
      return {
        success: false,
        error: error.message || "Failed to process refund",
      };
    }
  }
}

// Export singleton instance
module.exports = new RazorpayService();
