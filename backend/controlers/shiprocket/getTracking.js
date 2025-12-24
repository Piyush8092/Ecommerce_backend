const Order = require('../../models/orderModel');
const shiprocketService = require('../../services/shiprocketService');

/**
 * Get tracking information for an order
 * @route GET /api/getOrderTracking/:orderId
 * @access Private (User must own the order or be Admin/Manager)
 */
const getOrderTracking = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        
        // Find order
        const order = await Order.findById(orderId)
            .populate('userId', 'name email')
            .populate('deliveryAddressId');

        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found', 
                success: false, 
                error: true 
            });
        }

        // Check authorization - user must own the order or be admin/manager
        if (
            req.user.role !== 'ADMIN' && 
            req.user.role !== 'MANAGER' && 
            req.user._id.toString() !== order.userId._id.toString()
        ) {
            return res.status(401).json({ 
                message: 'Unauthorized', 
                success: false, 
                error: true 
            });
        }

        // Check if order has tracking information
        if (!order.trackingNumber && !order.shiprocketShipmentId) {
            return res.status(400).json({ 
                message: 'No tracking information available for this order', 
                success: false, 
                error: true,
                data: {
                    status: order.status,
                    message: 'Order has not been shipped yet'
                }
            });
        }

        let trackingData = null;

        // Try to get fresh tracking data from Shiprocket
        try {
            if (order.trackingNumber) {
                trackingData = await shiprocketService.trackShipment(order.trackingNumber);
            } else if (order.shiprocketShipmentId) {
                trackingData = await shiprocketService.getTrackingByShipmentId(order.shiprocketShipmentId);
            }

            // Update order with latest tracking information
            if (trackingData && trackingData.tracking_data) {
                const tracking = trackingData.tracking_data;
                
                order.shippingDetails = {
                    courierName: tracking.track_status === 1 ? tracking.courier_name : order.shippingDetails?.courierName,
                    awb: tracking.awb_code || order.trackingNumber,
                    currentStatus: tracking.shipment_status || order.shippingDetails?.currentStatus,
                    trackingUrl: tracking.track_url || order.shippingDetails?.trackingUrl,
                    shipmentHistory: tracking.shipment_track || order.shippingDetails?.shipmentHistory || [],
                };

                if (tracking.edd) {
                    order.estimatedDelivery = new Date(tracking.edd);
                }

                await order.save();
            }
        } catch (trackingError) {
            console.error('Error fetching tracking from Shiprocket:', trackingError.message);
            // Continue with stored data if API fails
        }

        // Return tracking information
        res.json({ 
            message: 'Tracking information retrieved successfully', 
            status: 200, 
            data: {
                orderId: order._id,
                orderStatus: order.status,
                trackingNumber: order.trackingNumber,
                estimatedDelivery: order.estimatedDelivery,
                shippingDetails: order.shippingDetails,
                liveTracking: trackingData,
            }, 
            success: true, 
            error: false 
        });

    } catch (error) {
        console.error('Get tracking error:', error);
        res.status(500).json({ 
            message: error.message || 'Failed to get tracking information', 
            status: 500, 
            success: false, 
            error: true 
        });
    }
};

module.exports = { getOrderTracking };

