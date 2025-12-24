const Order = require('../../models/orderModel');
const shiprocketService = require('../../services/shiprocketService');

/**
 * Generate shipping label for order
 * @route POST /api/generateShippingLabel/:orderId
 * @access Private (Admin, Manager, Employee)
 */
const generateShippingLabel = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        
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

        // Check if AWB generated
        if (!order.trackingNumber) {
            return res.status(400).json({ 
                message: 'AWB not generated yet. Please generate AWB first.', 
                success: false, 
                error: true 
            });
        }

        // Generate label
        const labelResponse = await shiprocketService.generateLabel([order.shiprocketShipmentId]);

        if (!labelResponse.label_created || labelResponse.label_created !== 1) {
            throw new Error('Failed to generate shipping label');
        }

        res.json({ 
            message: 'Shipping label generated successfully', 
            status: 200, 
            data: {
                orderId: order._id,
                labelUrl: labelResponse.label_url,
                shipmentId: order.shiprocketShipmentId,
            }, 
            success: true, 
            error: false 
        });

    } catch (error) {
        console.error('Generate label error:', error);
        res.status(500).json({ 
            message: error.message || 'Failed to generate shipping label', 
            status: 500, 
            success: false, 
            error: true 
        });
    }
};

module.exports = { generateShippingLabel };

