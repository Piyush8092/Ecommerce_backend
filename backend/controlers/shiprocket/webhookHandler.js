const Order = require('../../models/orderModel');

/**
 * Handle Shiprocket webhook notifications
 * @route POST /api/shiprocket/webhook
 * @access Public (Shiprocket webhook)
 */
const handleShiprocketWebhook = async (req, res) => {
    try {
        const webhookData = req.body;
        
        console.log('Shiprocket webhook received:', JSON.stringify(webhookData, null, 2));

        // Extract relevant information from webhook
        const {
            order_id,
            awb,
            shipment_status,
            current_status,
            courier_name,
            edd,
            shipment_track,
        } = webhookData;

        if (!order_id) {
            return res.status(400).json({ 
                message: 'Invalid webhook data: order_id missing', 
                success: false 
            });
        }

        // Find order by Shiprocket order ID
        const order = await Order.findOne({ shiprocketOrderId: order_id.toString() });

        if (!order) {
            console.log(`Order not found for Shiprocket order ID: ${order_id}`);
            return res.status(404).json({ 
                message: 'Order not found', 
                success: false 
            });
        }

        // Update order with webhook data
        let updated = false;

        if (awb && !order.trackingNumber) {
            order.trackingNumber = awb;
            updated = true;
        }

        if (shipment_status || current_status) {
            const status = shipment_status || current_status;
            
            // Update shipping details
            order.shippingDetails = {
                ...order.shippingDetails,
                currentStatus: status,
                courierName: courier_name || order.shippingDetails?.courierName,
                awb: awb || order.shippingDetails?.awb,
            };

            // Update order status based on shipment status
            if (status.toLowerCase().includes('delivered')) {
                order.status = 'DELIVERED';
            } else if (status.toLowerCase().includes('out for delivery')) {
                order.status = 'SHIPPED';
            }

            updated = true;
        }

        if (edd) {
            order.estimatedDelivery = new Date(edd);
            updated = true;
        }

        if (shipment_track && Array.isArray(shipment_track)) {
            order.shippingDetails = {
                ...order.shippingDetails,
                shipmentHistory: shipment_track.map(track => ({
                    status: track.status || track['sr-status'],
                    location: track.location || track['sr-status-label'],
                    timestamp: new Date(track.date || track['sr-status-date']),
                    activity: track.activity || track['sr-status-label'],
                })),
            };
            updated = true;
        }

        if (updated) {
            await order.save();
            console.log(`Order ${order._id} updated from webhook`);
        }

        // Acknowledge webhook
        res.status(200).json({ 
            message: 'Webhook processed successfully', 
            success: true 
        });

    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ 
            message: 'Failed to process webhook', 
            success: false, 
            error: error.message 
        });
    }
};

module.exports = { handleShiprocketWebhook };

