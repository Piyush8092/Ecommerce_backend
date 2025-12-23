 let Order = require('../../models/orderModel');
 let User = require('../../models/userModel');
 const shiprocketService = require('../../services/shiprocketService');

const updateOrderStatus = async (req, res) => {
    try {
        let id = req.params.id;
        let {status} = req.body;
        let existOrder = await Order.findById(id)
            .populate('userId', 'name email phone')
            .populate('deliveryAddressId')
            .populate('productId', 'name price image');

        if (!existOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        //can oder by user also ***************************. user can alos cancel his order
        if(req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER' && req.user._id.toString() !== existOrder.userId.toString() ) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if(status !== 'CANCELLED' && status !== 'DELIVERED' && status !== 'SHIPPED' && status !== 'ACCEPTED' ) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const previousStatus = existOrder.status;
        existOrder.status = status;

        // Auto-create shipment when status changes to SHIPPED (only for Admin/Manager)
        if (status === 'SHIPPED' && previousStatus !== 'SHIPPED' &&
            (req.user.role === 'ADMIN' || req.user.role === 'MANAGER')) {

            // Only create shipment if not already created
            if (!existOrder.shiprocketOrderId) {
                try {
                    // Prepare order items for Shiprocket
                    const orderItems = existOrder.productId.map(product => ({
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
                        orderId: existOrder._id.toString(),
                        orderDate: existOrder.createdAt.toISOString().split('T')[0],
                        billingAddress: existOrder.deliveryAddressId,
                        items: orderItems,
                        totalAmount: existOrder.totalAmount,
                        paymentMethod: existOrder.paymentMethod,
                        weight: orderItems.length * 0.5, // Default 0.5kg per item
                    };

                    // Create order in Shiprocket
                    const shiprocketResponse = await shiprocketService.createOrder(shiprocketOrderData);

                    if (shiprocketResponse.order_id) {
                        existOrder.shiprocketOrderId = shiprocketResponse.order_id.toString();
                        existOrder.shiprocketShipmentId = shiprocketResponse.shipment_id?.toString();

                        console.log(`Shiprocket order created for order ${id}: ${shiprocketResponse.order_id}`);
                    }
                } catch (shiprocketError) {
                    console.error('Shiprocket integration error:', shiprocketError.message);
                    // Continue with status update even if Shiprocket fails
                    // Admin can manually create shipment later
                }
            }
        }

        await existOrder.save();
        res.json({ message: 'Order status updated successfully', status: 200, data: existOrder, success: true, error: false });
    }
    catch (e) {
        console.error('Update order status error:', e);
        res.json({ message: 'Something went wrong', status: 500, data: e.message, success: false, error: true });
    }
};

module.exports = { updateOrderStatus };


