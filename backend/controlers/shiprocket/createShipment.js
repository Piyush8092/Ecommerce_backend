const Order = require('../../models/orderModel');
const shiprocketService = require('../../services/shiprocketService');

/**
 * Create shipment in Shiprocket when order status is SHIPPED
 * @route POST /api/createShipment/:orderId
 * @access Private (Admin, Manager, Employee)
 */
const createShipment = async (req, res) => {
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

        // Find order with populated fields
        const order = await Order.findById(orderId)
            .populate('userId', 'name email phone')
            .populate('deliveryAddressId')
            .populate('productId', 'name price image');

        if (!order) {
            return res.status(404).json({ 
                message: 'Order not found', 
                success: false, 
                error: true 
            });
        }

        // Check if shipment already created
        if (order.shiprocketOrderId) {
            return res.status(400).json({ 
                message: 'Shipment already created for this order', 
                success: false, 
                error: true,
                data: {
                    shiprocketOrderId: order.shiprocketOrderId,
                    trackingNumber: order.trackingNumber,
                }
            });
        }

        // Prepare order items for Shiprocket
        const orderItems = order.productId.map(product => ({
            name: product.name,
            sku: product._id.toString(),
            units: 1,
            selling_price: product.price,
            discount: 0,
            tax: 0,
            hsn: 0,
        }));

        // Prepare order data for Shiprocket
        const shiprocketOrderData = {
            orderId: order._id.toString(),
            orderDate: order.createdAt.toISOString().split('T')[0],
            billingAddress: order.deliveryAddressId,
            items: orderItems,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            weight: orderItems.length * 0.5, // Default 0.5kg per item
        };

        // Create order in Shiprocket
        const shiprocketResponse = await shiprocketService.createOrder(shiprocketOrderData);

        if (!shiprocketResponse.order_id) {
            throw new Error('Failed to create order in Shiprocket');
        }

        // Update order with Shiprocket details
        order.shiprocketOrderId = shiprocketResponse.order_id.toString();
        order.shiprocketShipmentId = shiprocketResponse.shipment_id?.toString();
        
        await order.save();

        res.json({ 
            message: 'Shipment created successfully', 
            status: 200, 
            data: {
                orderId: order._id,
                shiprocketOrderId: order.shiprocketOrderId,
                shiprocketShipmentId: order.shiprocketShipmentId,
                shiprocketResponse,
            }, 
            success: true, 
            error: false 
        });

    } catch (error) {
        console.error('Create shipment error:', error);
        res.status(500).json({ 
            message: error.message || 'Failed to create shipment', 
            status: 500, 
            success: false, 
            error: true 
        });
    }
};

module.exports = { createShipment };

