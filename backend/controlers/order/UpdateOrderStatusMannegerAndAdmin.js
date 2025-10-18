 let Order = require('../../models/orderModel');
 let User = require('../../models/userModel');

const updateOrderStatus = async (req, res) => {
    try {
        let id = req.params.id;
        let {status} = req.body;
        let existOrder = await Order.findById(id);
        if (!existOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if(req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER' ) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        if(status !== 'CANCELLED' && status !== 'DELIVERED' && status !== 'SHIPPED' && status !== 'ACCEPTED' ) {
            return res.status(400).json({ message: 'Invalid status' });
        }


        existOrder.status = status;
        await existOrder.save();
        res.json({ message: 'Order rejected successfully', status: 200, data: existOrder, success: true, error: false });
    }
    catch (e) {
        res.json({ message: 'Something went wrong', status: 500, data: e, success: false, error: true });
    }
};

module.exports = { updateOrderStatus };


