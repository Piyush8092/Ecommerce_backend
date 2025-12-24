const axios = require('axios');

/**
 * Shiprocket API Service
 * Handles all interactions with Shiprocket API for order shipping and tracking
 */

class ShiprocketService {
    constructor() {
        this.baseURL = 'https://apiv2.shiprocket.in/v1/external';
        this.token = null;
        this.tokenExpiry = null;
    }

    /**
     * Authenticate with Shiprocket API
     * @returns {Promise<string>} Access token
     */
    async authenticate() {
        try {
            // Check if token is still valid
            if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
                return this.token;
            }

            const response = await axios.post(`${this.baseURL}/auth/login`, {
                email: process.env.SHIPROCKET_EMAIL,
                password: process.env.SHIPROCKET_PASSWORD,
            });

            this.token = response.data.token;
            // Token typically expires in 10 days, set expiry to 9 days to be safe
            this.tokenExpiry = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000);
            
            return this.token;
        } catch (error) {
            console.error('Shiprocket authentication error:', error.response?.data || error.message);
            throw new Error('Failed to authenticate with Shiprocket');
        }
    }

    /**
     * Get authenticated headers for API requests
     * @returns {Promise<Object>} Headers object
     */
    async getHeaders() {
        const token = await this.authenticate();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    /**
     * Create order in Shiprocket
     * @param {Object} orderData - Order details
     * @returns {Promise<Object>} Shiprocket order response
     */
    async createOrder(orderData) {
        try {
            const headers = await this.getHeaders();
            
            const shiprocketOrderData = {
                order_id: orderData.orderId,
                order_date: orderData.orderDate,
                pickup_location: orderData.pickupLocation || "Primary",
                channel_id: "",
                comment: orderData.comment || "Order from E-commerce",
                billing_customer_name: orderData.billingAddress.name,
                billing_last_name: "",
                billing_address: orderData.billingAddress.Address,
                billing_address_2: orderData.billingAddress.landmark || "",
                billing_city: orderData.billingAddress.city,
                billing_pincode: orderData.billingAddress.zip,
                billing_state: orderData.billingAddress.state,
                billing_country: "India",
                billing_email: orderData.billingAddress.email,
                billing_phone: orderData.billingAddress.phoneNo,
                shipping_is_billing: true,
                order_items: orderData.items,
                payment_method: orderData.paymentMethod === 'CASH' ? 'COD' : 'Prepaid',
                shipping_charges: 0,
                giftwrap_charges: 0,
                transaction_charges: 0,
                total_discount: 0,
                sub_total: orderData.totalAmount,
                length: orderData.dimensions?.length || 10,
                breadth: orderData.dimensions?.breadth || 10,
                height: orderData.dimensions?.height || 10,
                weight: orderData.weight || 0.5,
            };

            const response = await axios.post(
                `${this.baseURL}/orders/create/adhoc`,
                shiprocketOrderData,
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Shiprocket create order error:', error.response?.data || error.message || error);
            throw new Error(error.response?.data?.message || 'Failed to create order in Shiprocket');
        }
    }

    /**
     * Generate AWB (Air Waybill) for shipment
     * @param {string} shipmentId - Shiprocket shipment ID
     * @param {string} courierId - Courier company ID
     * @returns {Promise<Object>} AWB response
     */
    async generateAWB(shipmentId, courierId) {
        try {
            const headers = await this.getHeaders();
            
            const response = await axios.post(
                `${this.baseURL}/courier/assign/awb`,
                {
                    shipment_id: shipmentId,
                    courier_id: courierId,
                },
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Shiprocket generate AWB error:', error.response?.data || error.message);
            throw new Error('Failed to generate AWB');
        }
    }

    /**
     * Get available courier services for a shipment
     * @param {string} shipmentId - Shiprocket shipment ID
     * @returns {Promise<Object>} Available couriers
     */
    async getAvailableCouriers(shipmentId) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.get(
                `${this.baseURL}/courier/serviceability/?shipment_id=${shipmentId}`,
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Shiprocket get couriers error:', error.response?.data || error.message);
            throw new Error('Failed to get available couriers');
        }
    }

    /**
     * Request pickup for shipment
     * @param {string} shipmentId - Shiprocket shipment ID
     * @returns {Promise<Object>} Pickup response
     */
    async requestPickup(shipmentId) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/courier/generate/pickup`,
                {
                    shipment_id: [shipmentId],
                },
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Shiprocket request pickup error:', error.response?.data || error.message);
            throw new Error('Failed to request pickup');
        }
    }

    /**
     * Track shipment by AWB or order ID
     * @param {string} awb - AWB number or order ID
     * @returns {Promise<Object>} Tracking information
     */
    async trackShipment(awb) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.get(
                `${this.baseURL}/courier/track/awb/${awb}`,
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Shiprocket track shipment error:', error.response?.data || error.message);
            throw new Error('Failed to track shipment');
        }
    }

    /**
     * Get tracking details by shipment ID
     * @param {string} shipmentId - Shiprocket shipment ID
     * @returns {Promise<Object>} Tracking details
     */
    async getTrackingByShipmentId(shipmentId) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.get(
                `${this.baseURL}/courier/track/shipment/${shipmentId}`,
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Shiprocket get tracking error:', error.response?.data || error.message);
            throw new Error('Failed to get tracking details');
        }
    }

    /**
     * Cancel shipment
     * @param {Array} awbs - Array of AWB numbers to cancel
     * @returns {Promise<Object>} Cancellation response
     */
    async cancelShipment(awbs) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/orders/cancel/shipment/awbs`,
                {
                    awbs: awbs,
                },
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Shiprocket cancel shipment error:', error.response?.data || error.message);
            throw new Error('Failed to cancel shipment');
        }
    }

    /**
     * Generate shipping label
     * @param {Array} shipmentIds - Array of shipment IDs
     * @returns {Promise<Object>} Label URL
     */
    async generateLabel(shipmentIds) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/courier/generate/label`,
                {
                    shipment_id: shipmentIds,
                },
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Shiprocket generate label error:', error.response?.data || error.message);
            throw new Error('Failed to generate shipping label');
        }
    }

    /**
     * Generate manifest for shipments
     * @param {Array} shipmentIds - Array of shipment IDs
     * @returns {Promise<Object>} Manifest response
     */
    async generateManifest(shipmentIds) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/manifests/generate`,
                {
                    shipment_id: shipmentIds,
                },
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Shiprocket generate manifest error:', error.response?.data || error.message);
            throw new Error('Failed to generate manifest');
        }
    }
}

// Export singleton instance
module.exports = new ShiprocketService();

