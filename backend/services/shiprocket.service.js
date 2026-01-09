const axios = require("axios");
const shiprocketConfig = require("../config/shiprocket.config");

/**
 * Shiprocket Service
 * Handles all Shiprocket shipment operations
 */
class ShiprocketService {
  constructor() {
    // Validate configuration on initialization
    shiprocketConfig.validate();

    this.apiUrl = shiprocketConfig.apiUrl;
    this.email = shiprocketConfig.email;
    this.password = shiprocketConfig.password;

    // Token cache
    this.token = null;
    this.tokenExpiresAt = null;
  }

  /**
   * Authenticate with Shiprocket and get access token
   * @returns {Promise<String>} Access token
   */
  async authenticate() {
    try {
      // Check if token is still valid
      if (
        this.token &&
        this.tokenExpiresAt &&
        Date.now() < this.tokenExpiresAt
      ) {
        return this.token;
      }

      const response = await axios.post(`${this.apiUrl}/auth/login`, {
        email: this.email,
        password: this.password,
      });

      if (response.data && response.data.token) {
        this.token = response.data.token;
        // Set token expiry to 9 days (Shiprocket tokens expire in 10 days)
        this.tokenExpiresAt = Date.now() + 9 * 24 * 60 * 60 * 1000;

        return this.token;
      }

      throw new Error("Failed to get authentication token");
    } catch (error) {
      console.error(
        "Shiprocket Authentication Error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Shiprocket authentication failed"
      );
    }
  }

  /**
   * Get authenticated axios instance
   * @returns {Promise<Object>} Axios instance with auth header
   */
  async getAuthenticatedClient() {
    const token = await this.authenticate();

    return axios.create({
      baseURL: this.apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Create Shiprocket Order
   * @param {Object} orderData - Order details
   * @returns {Promise<Object>} Shiprocket order response
   */
  async createOrder(orderData) {
    try {
      const client = await this.getAuthenticatedClient();

      const payload = {
        order_id: orderData.orderId,
        order_date:
          orderData.orderDate || new Date().toISOString().split("T")[0],
        pickup_location: shiprocketConfig.defaultPickupLocation,
        billing_customer_name: orderData.billingCustomerName,
        billing_last_name: orderData.billingLastName || "",
        billing_address: orderData.billingAddress,
        billing_city: orderData.billingCity,
        billing_pincode: orderData.billingPincode,
        billing_state: orderData.billingState,
        billing_country: orderData.billingCountry || "India",
        billing_email: orderData.billingEmail,
        billing_phone: orderData.billingPhone,
        shipping_is_billing: orderData.shippingIsBilling !== false,
        order_items: orderData.orderItems,
        payment_method: orderData.paymentType || "Prepaid",
        sub_total: orderData.subTotal,
        length: orderData.length || shiprocketConfig.options.length,
        breadth: orderData.breadth || shiprocketConfig.options.breadth,
        height: orderData.height || shiprocketConfig.options.height,
        weight: orderData.weight || shiprocketConfig.options.weight,
      };

      console.log("Shiprocket Order Payload:", payload);

      const response = await client.post("/orders/create/adhoc", payload);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Shiprocket Create Order Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create Shiprocket order",
      };
    }
  }

  /**
   * Generate AWB (Air Waybill) for shipment
   * @param {Number} shipmentId - Shiprocket shipment ID
   * @param {Number} courierId - Courier company ID
   * @returns {Promise<Object>} AWB generation response
   */
  async generateAWB(shipmentId, courierId) {
    try {
      const client = await this.getAuthenticatedClient();

      const payload = {
        shipment_id: shipmentId,
        courier_id: courierId,
      };

      const response = await client.post("/courier/assign/awb", payload);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Shiprocket Generate AWB Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to generate AWB",
      };
    }
  }

  /**
   * Request Pickup for shipment
   * @param {Number} shipmentId - Shiprocket shipment ID
   * @returns {Promise<Object>} Pickup request response
   */
  async requestPickup(shipmentId) {
    try {
      const client = await this.getAuthenticatedClient();

      const payload = {
        shipment_id: [shipmentId],
      };

      const response = await client.post("/courier/generate/pickup", payload);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Shiprocket Request Pickup Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to request pickup",
      };
    }
  }

  async cancelPickup(awb) {
    try {
      const client = await this.getAuthenticatedClient();

      const payload = {
        awb: awb,
      };

      const response = await client.post("/courier/cancel/pickup", payload);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Shiprocket Cancel Pickup Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to cancel pickup",
      };
    }
  }

  /**
   * Request pickup for multiple shipments
   * @param {Array<string>} shipmentIds
   */
  async requestPickupBulk(shipmentIds) {
    try {
      const client = await this.getAuthenticatedClient();

      const payload = {
        shipment_id: shipmentIds,
      };

      const response = await client.post("/courier/generate/pickup", payload);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Shiprocket Pickup Request Error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to request pickup",
      };
    }
  }

  /**
   * Get Shipment Tracking
   * @param {Number} shipmentId - Shiprocket shipment ID
   * @returns {Promise<Object>} Tracking information
   */
  async getTracking(shipmentId) {
    try {
      const client = await this.getAuthenticatedClient();

      const response = await client.get(
        `/courier/track/shipment/${shipmentId}`
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Shiprocket Get Tracking Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to get tracking information",
      };
    }
  }

  /**
   * Get Shipment Label
   * @param {Array} shipmentIds - Array of Shiprocket shipment IDs
   * @returns {Promise<Object>} Label URL
   */
  async generateLabel(shipmentIds) {
    try {
      const client = await this.getAuthenticatedClient();

      const payload = {
        shipment_id: Array.isArray(shipmentIds) ? shipmentIds : [shipmentIds],
      };

      const response = await client.post("/courier/generate/label", payload);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Shiprocket Generate Label Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to generate label",
      };
    }
  }

  /**
   * Get Shipment Invoice
   * @param {Array} orderIds - Array of order IDs
   * @returns {Promise<Object>} Invoice URL
   */
  async generateInvoice(orderIds) {
    try {
      const client = await this.getAuthenticatedClient();

      const payload = {
        ids: Array.isArray(orderIds) ? orderIds : [orderIds],
      };

      const response = await client.post("/orders/print/invoice", payload);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Shiprocket Generate Invoice Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to generate invoice",
      };
    }
  }

  /**
   * Get Available Couriers for shipment
   * @param {Object} params - Shipment parameters
   * @returns {Promise<Object>} Available couriers
   */
  async getAvailableCouriers(params) {
    try {
      const client = await this.getAuthenticatedClient();

      const response = await client.get("/courier/serviceability", {
        params: {
          pickup_postcode: params.pickupPostcode,
          delivery_postcode: params.deliveryPostcode,
          weight: params.weight || shiprocketConfig.options.weight,
          cod: params.cod || 0,
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Shiprocket Get Couriers Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to get available couriers",
      };
    }
  }

  /** Generate Batch Manifest */
  async generateBatchManifest(awbs) {
    try {
      const client = await this.getAuthenticatedClient();

      const response = await client.post("/manifests/generate", {
        awbs: Array.isArray(awbs) ? awbs : [awbs],
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Track Multiple Shipments by AWB
   */
  async trackMultipleShipments(awbNumbers) {
    try {
      const client = await this.getAuthenticatedClient();

      const response = await client.post("/courier/track/awbs", { awbNumbers });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Shiprocket Track Multiple Error:",
        error.response?.data || error.message
      );

      return {
        success: false,
        error: error.response?.data?.message || "Failed to track shipments",
      };
    }
  }

  /**
   * Cancel Shipment
   * Cancel Shipment by AWBs or Order ID (Admin only) (Shiprocket API)
   * @param {Array} awbs - Array of AWB numbers or Order ID to cancel (Admin only) (Shiprocket API)
   * @returns {Promise<Object>} Cancellation response
   */
  async cancelShipment(awbs) {
    try {
      const client = await this.getAuthenticatedClient();

      const payload = {
        awbs: Array.isArray(awbs) ? awbs : [awbs],
      };

      const response = await client.post(
        "/orders/cancel/shipment/awbs",
        payload
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Shiprocket Cancel Shipment Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to cancel shipment",
      };
    }
  }

  /** Cancel Order */
  async cancelOrder(orderId) {
    try {
      const client = await this.getAuthenticatedClient();

      const response = await client.post(`/orders/cancel/${orderId}`);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Shiprocket Cancel Order Error:",
        error.response?.data || error.message
      );
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to cancel order",
      };
    }
  }
}

// Export singleton instance
module.exports = new ShiprocketService();
