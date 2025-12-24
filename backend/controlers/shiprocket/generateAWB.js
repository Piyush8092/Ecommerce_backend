const Order = require('../../models/orderModel');
const shiprocketService = require('../../services/shiprocketService');

/**
 * Generate AWB (Air Waybill) for shipment
 * @route POST /api/generateAWB/:orderId
 * @access Private (Admin, Manager, Employee)
 */
const generateAWB = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { courierId } = req.body;
        
        // Check authorization
        if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER' && req.user.role !== 'EMPLOYEE') {
            return res.status(401).json({ 
                message: 'Unauthorized', 
                success: false, 
                error: true 
            });
        }

        // Find order
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found', 
                success: false, 
                error: true 
            });
        }

        // Check if shipment exists
        if (!order.shiprocketShipmentId) {
            return res.status(400).json({ 
                message: 'Shipment not created yet. Please create shipment first.', 
                success: false, 
                error: true 
            });
        }

        // Check if AWB already generated
        if (order.trackingNumber) {
            return res.status(400).json({ 
                message: 'AWB already generated for this order', 
                success: false, 
                error: true,
                data: {
                    trackingNumber: order.trackingNumber,
                }
            });
        }

        let selectedCourierId = courierId;

        // If courier not specified, get the best available courier
        if (!selectedCourierId) {
            const couriers = await shiprocketService.getAvailableCouriers(order.shiprocketShipmentId);
            
            if (!couriers.data || !couriers.data.available_courier_companies || couriers.data.available_courier_companies.length === 0) {
                return res.status(400).json({ 
                    message: 'No courier services available for this shipment', 
                    success: false, 
                    error: true 
                });
            }

            // Select the first recommended courier
            selectedCourierId = couriers.data.available_courier_companies[0].courier_company_id;
        }

        // Generate AWB
        const awbResponse = await shiprocketService.generateAWB(order.shiprocketShipmentId, selectedCourierId);

        if (!awbResponse.awb_assign_status || awbResponse.awb_assign_status !== 1) {
            throw new Error(awbResponse.response?.data?.message || 'Failed to generate AWB');
        }

        // Update order with AWB details
        order.trackingNumber = awbResponse.response.data.awb_code;
        order.shippingDetails = {
            ...order.shippingDetails,
            awb: awbResponse.response.data.awb_code,
            courierName: awbResponse.response.data.courier_name,
            currentStatus: 'AWB Generated',
        };

        await order.save();

        // Request pickup
        try {
            await shiprocketService.requestPickup(order.shiprocketShipmentId);
        } catch (pickupError) {
            console.error('Pickup request error:', pickupError.message);
            // Continue even if pickup request fails
        }

        res.json({ 
            message: 'AWB generated successfully', 
            status: 200, 
            data: {
                orderId: order._id,
                trackingNumber: order.trackingNumber,
                courierName: order.shippingDetails.courierName,
                awbResponse,
            }, 
            success: true, 
            error: false 
        });

    } catch (error) {
        console.error('Generate AWB error:', error);
        res.status(500).json({ 
            message: error.message || 'Failed to generate AWB', 
            status: 500, 
            success: false, 
            error: true 
        });
    }
};

module.exports = { generateAWB };

